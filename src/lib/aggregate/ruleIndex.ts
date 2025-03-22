import NodeToPod from "$lib/aggregate/rules/NodeToPod";
import type {Rule} from "$lib/aggregate/ruleType";
import type {ClusterData} from "$lib/aggregate/k8sFetch";
import type {Graph} from "$lib/graph/Graph";

export const aggregationRules = {
    "Node -> Pod": NodeToPod
} satisfies Record<string, Rule>;
export type AggregationRules = typeof aggregationRules;

export const defaultRules: (keyof AggregationRules)[] = [
    "Node -> Pod"
]

export const executeRules = (
    data: Partial<ClusterData>,
    graph: Graph,
    rules: (keyof AggregationRules)[]
) => {
    for (const ruleName of rules) {
        if (!(ruleName in aggregationRules)) continue;

        const dataSatisfied =
            aggregationRules[ruleName].requiredData
                .reduce(
                    (acc, v) => acc && !!data[v],
                    true
                )
        if (!dataSatisfied) continue;

        // safe to cast, as it has been ensured all required data is present
        aggregationRules[ruleName].execute(data as ClusterData, graph);
    }
}
