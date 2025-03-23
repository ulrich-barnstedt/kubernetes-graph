import type {Rule} from "$lib/server/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../k8sFetch";
import {objectByName} from "$lib/server/aggregate/rules/utils/utils";

export default {
    requiredData: [
        "pods", "nodes"
    ],
    execute: function (data: ClusterData, graph: Graph): void {
        for (const pod of data.pods.items) {
            graph.createRelationByIds(
                pod.metadata?.uid!,
                objectByName(data.nodes, pod.spec?.nodeName!)?.metadata?.uid!
            );
        }
    }
} satisfies Rule;
