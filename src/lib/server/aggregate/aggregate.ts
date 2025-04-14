import {type ClusterData, fetchClusterData} from "$lib/server/aggregate/k8sFetch";
import {type AggregationRules, executeRules} from "$lib/server/aggregate/ruleIndex";
import {Graph} from "$lib/graph/Graph";
import {GraphNode} from "$lib/graph/GraphNode";
import {ErrorNode} from "$lib/graph/ErrorNode";

export const constructAggregatedGraph = async (
    types: (keyof ClusterData)[],
    rules: (keyof AggregationRules)[],
    namespace: string
) : Promise<Graph> => {
    const graph = new Graph();

    try {
        const data = await fetchClusterData(types, namespace);
        const nodes = Object.values(data).map(list => list.items).flat().map((obj) => new GraphNode(obj));

        graph.addNodes(...nodes);
        await executeRules(data, graph, rules);
    } catch (e) {
        graph.addNodes(new ErrorNode(e));
    }

    return graph;
}
