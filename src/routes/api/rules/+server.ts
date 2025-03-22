import {aggregationRules, type AggregationRules, defaultRules} from "$lib/aggregate/ruleIndex";
import {json} from "@sveltejs/kit";
import type {SelectableSpec} from "../SelectableSpec";

export type RulesSpecification = SelectableSpec<AggregationRules>;

export const GET = () => {
    const spec: RulesSpecification = {
        available: Object.keys(aggregationRules) as (keyof AggregationRules)[],
        defaultSelected: defaultRules
    }

    return json(spec);
}
