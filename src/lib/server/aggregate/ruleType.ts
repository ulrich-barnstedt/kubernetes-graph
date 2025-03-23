import type {ClusterData} from "$lib/server/aggregate/k8sFetch";
import type {Graph} from "$lib/graph/Graph";

export interface Rule {
    requiredData: (keyof ClusterData)[],
    execute:
        ((data: ClusterData, graph: Graph) => Promise<void>) |
        ((data: ClusterData, graph: Graph) => void)
}
