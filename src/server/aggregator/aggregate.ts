import {ClusterData, fetchClusterData} from "./apiCollector.js";
import {KubernetesObject} from "@kubernetes/client-node";
import {Graph} from "../../shared/graph/Graph.js";
import {GraphNode} from "../../shared/graph/GraphNode.js";
import {kube} from "../k8sClient.js";

const mapToId = (list: KubernetesObject[]): Record<string, string> => {
    return Object.fromEntries(list.map(n => [n.metadata?.name!, n.metadata?.uid!]));
}

const findNamespaceObject = (node: GraphNode, visited: GraphNode[]) : GraphNode | null => {
    if (node.kind === "V1Namespace") return node;

    const nodeVisited = (sN: GraphNode) => visited.find(n => n === sN) !== undefined;
    visited.push(node);

    const allRelations: GraphNode[] = [
        ...node.incoming.filter(r => r.sameNamespace).map(r => r.from),
        ...node.outgoing.filter(r => r.sameNamespace).map(r => r.to),
    ]

    for (const relatedNode of allRelations) {
        if (nodeVisited(relatedNode)) continue;
        let result = findNamespaceObject(relatedNode, visited);
        if (result) return result;
    }

    return null;
}

export const createRelations = async (
    graph: Graph,
    data: ClusterData,
    allObjects: KubernetesObject[]
) => {
    const nameToIndex: Record<string, Record<string, string>> = {
        namespace: mapToId(data.namespaces.items),
        node: mapToId(data.nodes.items),
        serviceAccounts: mapToId(data.serviceAccounts.items),
    }

    for (const pod of data.pods.items) {
        graph.createRelationByIds(pod.metadata?.uid!, nameToIndex.node[pod.spec?.nodeName!]);
    }

    for (const daemonSet of data.daemonSets.items) {
        if (!daemonSet.spec?.template.spec?.serviceAccountName) continue;

        graph.createRelationByIds(daemonSet.metadata?.uid!, nameToIndex.serviceAccounts[daemonSet.spec.template.spec.serviceAccountName]);
    }

    for (const service of data.services.items) {
        if (!service.spec?.selector) continue;

        const pods = await kube.core.listNamespacedPod({
            namespace: service.metadata?.namespace!,
            labelSelector: Object.entries(service.spec.selector).map(kv => kv.join("=")).join(",")
        })
        for (const pod of pods.items) {
            graph.createRelationByIds(service.metadata?.uid!, pod.metadata?.uid!);
        }
    }

    for (const endpoint of data.endpoints.items) {
        if (!endpoint.subsets) continue;

        for (const subset of endpoint.subsets) {
            const addresses = [
                ...(subset.addresses ?? []),
                ...(subset.notReadyAddresses ?? [])
            ]
            for (const address of addresses) {
                if (!address.targetRef?.uid) continue;

        	graph.createRelationByIds(endpoint.metadata?.uid!, address.targetRef?.uid!);
            }
        }
    }

    for (const obj of allObjects) {
        if (!obj.metadata!.ownerReferences) continue;

        for (const ref of obj.metadata!.ownerReferences) {
            graph.createRelationByIds(obj.metadata!.uid!, ref.uid);
        }
    }

    // ensure all objects have a direct path to their namespace
    // order of connections is important, excludes: namespace, node
    const prioritizedObjectList: KubernetesObject[] = [
        ...data.deployments.items,
        ...data.replicationControllers.items,
        ...data.replicaSets.items,

        ...data.statefulSets.items,
        ...data.daemonSets.items,

        ...data.pods.items,

        ...data.serviceAccounts.items,
        ...data.endpoints.items,
        ...data.services.items,
        ...data.jobs.items
    ]
    for (const obj of prioritizedObjectList) {
        if (!obj.metadata?.namespace) continue;

        const node = graph.getNodeById(obj.metadata.uid!);
        const namespaceNode = findNamespaceObject(node, []);
        if (namespaceNode) continue;

        graph.createRelationByIds(
            obj.metadata?.uid!,
            nameToIndex.namespace[obj.metadata?.namespace!]
        );
    }
}

export const constructAggregatedGraph = async () : Promise<Graph> => {
    const graph = new Graph();
    const data = await fetchClusterData();
    const allObjects: KubernetesObject[] = Object.values(data).map(obj => obj.items).flat();

    graph.addNodes(...allObjects.map(o => new GraphNode(o)));
    await createRelations(graph, data, allObjects);

    return graph;
}
