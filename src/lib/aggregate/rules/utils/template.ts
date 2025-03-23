import type {Rule} from "$lib/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../../k8sFetch";

export default {
    requiredData: [],
    execute: function (data: ClusterData, graph: Graph): void {

    }
} satisfies Rule;
