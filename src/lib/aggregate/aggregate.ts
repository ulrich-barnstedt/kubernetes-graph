import {type ClusterData, fetchClusterData} from "$lib/aggregate/k8sFetch";
import {type AggregationRules, executeRules} from "$lib/aggregate/ruleIndex";
import {Graph} from "$lib/graph/Graph";
import {GraphNode} from "$lib/graph/GraphNode";

export const constructAggregatedGraph = async (types: (keyof ClusterData)[], rules: (keyof AggregationRules)[]) : Promise<Graph> => {
    const graph = new Graph();
    const data = await fetchClusterData(types);
    const nodes = Object.values(data).map(list => list.items).flat().map((obj) => new GraphNode(obj));

    graph.addNodes(...nodes);
    executeRules(data, graph, rules);

    return graph;
}
