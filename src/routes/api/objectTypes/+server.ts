import {supportedObjectTypes} from "$lib/aggregate/k8sFetch";
import {json} from "@sveltejs/kit";

export const GET = async () => {
    return json(Object.keys(supportedObjectTypes));
}
