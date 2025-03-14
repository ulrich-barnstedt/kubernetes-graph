import {fetchClusterData} from "./apiCollector.js";
import {KubernetesObject} from "@kubernetes/client-node";
import {Graph} from "../../shared/graph/Graph.js";
import {GraphNode} from "../../shared/graph/GraphNode.js";
import {kube} from "../k8sClient.js";

export const constructAggregatedGraph = async () : Promise<Graph> => {
    const graph = new Graph();
    const data = await fetchClusterData();

    // helper mappings
    const objects: KubernetesObject[] = Object.values(data).map(obj => obj.items).flat();
    const namespaceToId: Record<string, string> = Object.fromEntries(data.namespaces.items.map(n => [n.metadata?.name, n.metadata?.uid]));

    // TODO: relationship to nodes
    // TODO: popup window on click of node with specs, ...

    graph.addNodes(...objects.map(o => new GraphNode(o)));

    for (const deployment of data.deployments.items) {
        graph.createRelationByIds(deployment.metadata?.uid!, namespaceToId[deployment.metadata?.namespace!]);
    }
    for (const account of data.serviceAccounts.items) {
        graph.createRelationByIds(account.metadata?.uid!, namespaceToId[account.metadata?.namespace!]);
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
    for (const obj of objects) {
        if (!obj.metadata!.ownerReferences) continue;

        for (const ref of obj.metadata!.ownerReferences) {
            graph.createRelationByIds(obj.metadata!.uid!, ref.uid);
        }
    }

    return graph;
}
