import {constructAggregatedGraph} from "$lib/aggregate/aggregate";
import {serialize} from "@ungap/structured-clone";
import {json} from "@sveltejs/kit";

export const POST = async () => {
    const graph = await constructAggregatedGraph();

    return json(serialize(graph));
}
