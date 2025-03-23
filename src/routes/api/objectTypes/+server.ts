import {type ClusterData, defaultObjectTypes, supportedObjectTypes} from "$lib/server/aggregate/k8sFetch";
import {json} from "@sveltejs/kit";
import type {SelectableSpec} from "../SelectableSpec";

export type ObjectTypesSpecification = SelectableSpec<ClusterData>;

export const GET = async () => {
    const spec: ObjectTypesSpecification = {
        available: Object.keys(supportedObjectTypes) as (keyof ClusterData)[],
        defaultSelected: defaultObjectTypes
    }

    return json(spec);
}
