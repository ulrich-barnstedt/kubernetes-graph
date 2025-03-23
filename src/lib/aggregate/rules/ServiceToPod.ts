import type {Rule} from "$lib/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../k8sFetch";
import {kube} from "$lib/aggregate/k8sClient";

export default {
    requiredData: [
        "pods",
        "services"
    ],
    execute: async function (data: ClusterData, graph: Graph): Promise<void> {
        for (const service of data.services.items) {
            if (!service.spec?.selector) continue;

            const pods = await kube.core.listNamespacedPod({
                namespace: service.metadata?.namespace!,
                labelSelector: Object.entries(service.spec.selector).map(kv => kv.join("=")).join(",")
            })
            for (const pod of pods.items) {
                graph.createRelationByIds(service.metadata?.uid!, pod.metadata?.uid!);
            }
        }
    }
} satisfies Rule;
