import {kube} from "$lib/server/aggregate/k8sClient";
import {json} from "@sveltejs/kit";

export const GET = async () => {
    if (!kube.validConfig) return json([]);

    return json((await kube.core.listNamespace()).items.map(n => n.metadata?.name));
}
