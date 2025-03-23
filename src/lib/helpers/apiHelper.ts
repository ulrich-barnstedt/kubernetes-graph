import type {ObjectTypesSpecification} from "../../routes/api/objectTypes/+server";
import type {RulesSpecification} from "../../routes/api/rules/+server";
import type {AggregationSpec} from "../../routes/api/aggregate/+server";
import {Graph} from "$lib/graph/Graph";
import {deserialize} from "@ungap/structured-clone";

export const getObjectTypes = async () : Promise<ObjectTypesSpecification> => {
    const response = await fetch("/api/objectTypes");
    return await response.json();
}

export const getRules = async () : Promise<RulesSpecification> => {
    const response = await fetch("/api/rules");
    return await response.json();
}

export const getNamespaces = async () : Promise<string[]> => {
    const response = await fetch("/api/namespaces");
    return await response.json();
}

export const aggregate = async (body: AggregationSpec) : Promise<Graph> => {
    const apiResponse = await fetch("/api/aggregate", {
        method: "POST",
        body: JSON.stringify(body)
    });
    const json = await apiResponse.json();

    return Graph.fromSerialized(deserialize(json));
}
