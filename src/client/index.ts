import {deserialize} from "@ungap/structured-clone";
import {Graph} from "../shared/graph/Graph";
import {drawNetwork} from "./render";

const getCurrentGraph = async () : Promise<Graph> => {
    const apiResponse = await fetch("/graph");
    const json = await apiResponse.json();

    return Graph.fromSerialized(deserialize(json));
}

(async () => {
    const graph = await getCurrentGraph();

    drawNetwork(graph);
})();
