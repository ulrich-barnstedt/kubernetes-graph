import type {Rule} from "$lib/server/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../k8sFetch";

export default {
    requiredData: [],
    execute: function (data: ClusterData, graph: Graph): void {
        const allObjs = Object.values(data).map(l => l.items).flat();

        for (const obj of allObjs) {
            if (!obj.metadata!.ownerReferences) continue;

            for (const ref of obj.metadata!.ownerReferences) {
                if (graph.getNodeById(ref.uid) === undefined) continue;

                graph.createRelationByIds(obj.metadata!.uid!, ref.uid);
            }
        }
    }
} satisfies Rule;
