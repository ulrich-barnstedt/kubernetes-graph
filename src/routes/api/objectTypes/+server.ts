import {type ClusterData, defaultObjectTypes, supportedObjectTypes} from "$lib/aggregate/k8sFetch";
import {json} from "@sveltejs/kit";

export interface ObjectTypesSpecification {
    available: (keyof ClusterData)[],
    defaultSelected: (keyof ClusterData)[]
}

export const GET = async () => {
    const spec: ObjectTypesSpecification = {
        available: Object.keys(supportedObjectTypes) as (keyof ClusterData)[],
        defaultSelected: defaultObjectTypes
    }

    return json(spec);
}
