import type {Rule} from "$lib/server/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../k8sFetch";
import type {KubernetesListObject} from "@kubernetes/client-node";
import {GraphNode} from "$lib/graph/GraphNode";
import {objectByName} from "$lib/server/aggregate/rules/utils/utils";

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

// ensure all objects have a direct path to their namespace
export default {
    requiredData: [
        "namespaces"
    ],
    execute: function (data: ClusterData, graph: Graph): void {
        // order of connections is important, excludes: namespace, node
        const prioritizedLists: KubernetesListObject<any>[] = [
            data.deployments,
            data.replicationControllers,
            data.replicaSets,

            data.statefulSets,
            data.daemonSets,

            data.pods,

            data.roles,
            data.serviceAccounts,

            data.endpoints,
            data.services,
            data.jobs
        ]
        const objectList = prioritizedLists.filter(l => l).map(l => l.items).flat();

        for (const obj of objectList) {
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
