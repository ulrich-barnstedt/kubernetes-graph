import type {ClusterData} from "$lib/aggregate/k8sFetch";
import type {Graph} from "$lib/graph/Graph";

export interface Rule {
    requiredData: (keyof ClusterData)[],
    execute: (data: ClusterData, graph: Graph) => void
}
