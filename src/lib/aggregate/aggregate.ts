import {type ClusterData, fetchClusterData} from "./apiCollector.js";
import type {KubernetesObject} from "@kubernetes/client-node";
import {Graph} from "$lib/graph/Graph";
import {GraphNode} from "$lib/graph/GraphNode";
import {kube} from "$lib/aggregate/k8sClient";

const mapToId = (list: KubernetesObject[]): Record<string, string> => {
    return Object.fromEntries(list.map(n => [n.metadata?.name!, n.metadata?.uid!]));
}
const mapToNamespacedId = (list: KubernetesObject[]): Record<string, Record<string, string>> => {
    const namespaced: Record<string, Record<string, string>> = {};
    for (const item of list) {
        if (!(item.metadata?.namespace! in namespaced)) {
            namespaced[item.metadata?.namespace!] = {};
        }

        namespaced[item.metadata?.namespace!][item.metadata?.name!] = item.metadata?.uid!;
    }

    return namespaced;
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
    renderedObjects: KubernetesObject[]
) => {
    const nameToID: Record<string, Record<string, string>> = {
        namespace: mapToId(data.namespaces.items),
        node: mapToId(data.nodes.items),
        serviceAccounts: mapToId(data.serviceAccounts.items),
        clusterRoles: mapToId(data.clusterRoles.items)
    }
    // indexing: namespacedNameToID[type][namespace][name]
    const namespacedNameToID: Record<string, Record<string, Record<string, string>>> = {
        serviceAccounts: mapToNamespacedId(data.serviceAccounts.items),
        roles: mapToNamespacedId(data.roles.items)
    }

    for (const pod of data.pods.items) {
        graph.createRelationByIds(pod.metadata?.uid!, nameToID.node[pod.spec?.nodeName!]);
    }

    for (const daemonSet of data.daemonSets.items) {
        if (!daemonSet.spec?.template.spec?.serviceAccountName) continue;

        graph.createRelationByIds(daemonSet.metadata?.uid!, nameToID.serviceAccounts[daemonSet.spec.template.spec.serviceAccountName]);
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

    // TODO: fix undefined refs
    for (const roleBinding of [...data.roleBindings.items, ...data.clusterRoleBindings.items]) {
        if (!roleBinding.subjects) continue;

        for (const subject of roleBinding.subjects) {
            if (subject.kind !== "ServiceAccount") continue;

            const serviceAccIndex = subject.namespace ? namespacedNameToID.serviceAccounts[subject.namespace] : nameToID.serviceAccounts;
            const roleIndex = roleBinding.metadata?.namespace ? namespacedNameToID.roles[roleBinding.metadata.namespace] : nameToID.clusterRoles;

            // not all bindings have to have valid subjects
            if (serviceAccIndex[subject.name] === undefined) continue;
            graph.createRelationByIds(
                serviceAccIndex[subject.name],
                roleIndex[roleBinding.roleRef.name]
            )
        }
    }

    for (const obj of renderedObjects) {
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

        ...data.roles.items,
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
            nameToID.namespace[obj.metadata?.namespace!]
        );
    }
}

export const constructAggregatedGraph = async () : Promise<Graph> => {
    const graph = new Graph();
    const data = await fetchClusterData();

    const renderedData: Partial<ClusterData> = {...data};
    delete renderedData.roleBindings;
    delete renderedData.clusterRoleBindings;
    const renderedObjects: KubernetesObject[] = Object.values(renderedData).map(obj => obj.items).flat();

    graph.addNodes(...renderedObjects.map(o => new GraphNode(o)));
    await createRelations(graph, data, renderedObjects);

    return graph;
}
