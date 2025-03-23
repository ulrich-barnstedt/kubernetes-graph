import type {AggregationSpec} from "../../routes/api/aggregate/+server";
import type {ClusterData} from "$lib/server/aggregate/k8sFetch";
import type {AggregationRules} from "$lib/server/aggregate/ruleIndex";
import {specifications} from "$lib/state/specifications";

class AggregationSpecification implements AggregationSpec {
    public objectTypes: (keyof ClusterData)[] = $state([]);
    public rules: (keyof AggregationRules)[] = $state([]);
    public namespace: string = $state("");
    private initialized: boolean = $state(false);

    private async init () {
        this.objectTypes = (await specifications.objectTypes()).defaultSelected;
        this.rules = (await specifications.rules()).defaultSelected;
        this.namespace = "";
        this.initialized = true;
    }

    public isInitialized () {
        return this.initialized;
    }

    constructor () {
        this.init();
    }
}

export const aggregationSpecification = new AggregationSpecification();
