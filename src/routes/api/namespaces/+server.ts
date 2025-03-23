import {kube} from "$lib/server/aggregate/k8sClient";
import {json} from "@sveltejs/kit";

export const GET = async () => {
    return json((await kube.core.listNamespace()).items.map(n => n.metadata?.name));
}
