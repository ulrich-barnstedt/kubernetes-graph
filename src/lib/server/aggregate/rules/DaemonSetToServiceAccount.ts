import type {Rule} from "$lib/server/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../k8sFetch";
import {objectByName} from "$lib/server/aggregate/rules/utils/utils";

export default {
    requiredData: [
        "daemonSets",
        "serviceAccounts"
    ],
    execute: function (data: ClusterData, graph: Graph): void {
        for (const daemonSet of data.daemonSets.items) {
            if (!daemonSet.spec?.template.spec?.serviceAccountName) continue;

            graph.createRelationByIds(
                daemonSet.metadata?.uid!,
                objectByName(data.serviceAccounts, daemonSet.spec.template.spec.serviceAccountName)?.metadata?.uid!
            );
        }
    }
} satisfies Rule;
