import type {Rule} from "$lib/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../k8sFetch";
import type {KubernetesObject} from "@kubernetes/client-node";
import {GraphNode} from "$lib/graph/GraphNode";
import {objectByName} from "$lib/aggregate/rules/_utils";

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

export default {
    requiredData: [
        "namespaces"
    ],
    execute: function (data: ClusterData, graph: Graph): void {
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
                objectByName(data.namespaces, obj.metadata?.namespace!)?.metadata?.uid!
            );
        }
    }
} satisfies Rule;
