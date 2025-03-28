import {serialize} from "@ungap/structured-clone";
import {json} from "@sveltejs/kit";
import {constructAggregatedGraph} from "$lib/server/aggregate/aggregate";
import type {ClusterData} from "$lib/server/aggregate/k8sFetch";
import type {AggregationRules} from "$lib/server/aggregate/ruleIndex";

export interface AggregationSpec {
    objectTypes: (keyof ClusterData)[],
    rules: (keyof AggregationRules)[],
    namespace: string,
}

export const POST = async ({request}) => {
    const body = (await request.json()) as Partial<AggregationSpec>;
    const graph = await constructAggregatedGraph(
        body.objectTypes ?? [],
        body.rules ?? [],
        body.namespace ?? ""
    );

    return json(serialize(graph));
}
