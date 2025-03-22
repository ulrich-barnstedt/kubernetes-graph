import {serialize} from "@ungap/structured-clone";
import {json} from "@sveltejs/kit";
import {constructAggregatedGraph} from "$lib/aggregate/aggregate";

export const POST = async ({request}) => {
    const body = await request.json();
    const graph = await constructAggregatedGraph(
        body.objectTypes ?? [],
        body.rules ?? []
    );

    return json(serialize(graph));
}
