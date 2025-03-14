import {ClusterData, fetchClusterData} from "./apiCollector.js";
import {KubernetesObject} from "@kubernetes/client-node";
import {Graph} from "../../shared/graph/Graph.js";
import {GraphNode} from "../../shared/graph/GraphNode.js";
import {kube} from "../k8sClient.js";

export const createRelations = async (
    graph: Graph,
    data: ClusterData,
    allObjects: KubernetesObject[]
) => {
    const nameToIndex: Record<string, Record<string, string>> = {
        namespace: Object.fromEntries(data.namespaces.items.map(n => [n.metadata?.name, n.metadata?.uid])),
        node: Object.fromEntries(data.nodes.items.map(n => [n.metadata?.name!, n.metadata?.uid!]))
    }

    for (const deployment of data.deployments.items) {
        graph.createRelationByIds(deployment.metadata?.uid!, nameToIndex.namespace[deployment.metadata?.namespace!]);
    }

    for (const account of data.serviceAccounts.items) {
        graph.createRelationByIds(account.metadata?.uid!, nameToIndex.namespace[account.metadata?.namespace!]);
    }

    for (const pod of data.pods.items) {
        graph.createRelationByIds(pod.metadata?.uid!, nameToIndex.node[pod.spec?.nodeName!]);
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
}

export const constructAggregatedGraph = async () : Promise<Graph> => {
    const graph = new Graph();
    const data = await fetchClusterData();
    const allObjects: KubernetesObject[] = Object.values(data).map(obj => obj.items).flat();

    graph.addNodes(...allObjects.map(o => new GraphNode(o)));
    await createRelations(graph, data, allObjects);

    return graph;
}
