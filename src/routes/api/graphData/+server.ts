import {constructAggregatedGraph} from "./aggregator/aggregate";
import {serialize} from "@ungap/structured-clone";
import {json} from "@sveltejs/kit";

export const GET = async () => {
    const graph = await constructAggregatedGraph();

    return json(serialize(graph));
}
