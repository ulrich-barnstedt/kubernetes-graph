import type {Rule} from "$lib/server/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../k8sFetch";

export default {
    requiredData: [
        "endpoints"
    ],
    execute: function (data: ClusterData, graph: Graph): void {
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
    }
} satisfies Rule;
