import {fetchClusterData} from "./apiCollector.js";
import {KubernetesObject} from "@kubernetes/client-node";
import {Graph} from "../../shared/graph/Graph.js";
import {GraphNode} from "../../shared/graph/GraphNode.js";

export const constructAggregatedGraph = async () : Promise<Graph> => {
    const graph = new Graph();
    const data = await fetchClusterData();

    const objects: KubernetesObject[] = Object.values(data).map(obj => obj.items).flat();
    graph.addNodes(...objects.map(o => new GraphNode(o)));

    for (const obj of objects) {
        if (!obj.metadata!.ownerReferences) continue;

        for (const ref of obj.metadata!.ownerReferences) {
            graph.createRelationByIds(obj.metadata!.uid!, ref.uid);
        }
    }

    return graph;
}
