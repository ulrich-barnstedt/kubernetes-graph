import type {Rule} from "$lib/aggregate/ruleType";
import type {Graph} from "$lib/graph/Graph";
import type {ClusterData} from "../k8sFetch";
import {namespacedObjectByName, objectByName} from "$lib/aggregate/rules/_utils";

export default {
    requiredData: [
        "roles",
        "roleBindings",
        "clusterRoles",
        "clusterRoleBindings"
    ],
    execute: function (data: ClusterData, graph: Graph): void {
        // TODO: implement variant which explicitly and not implicitly resolves
        for (const roleBinding of [...data.roleBindings.items, ...data.clusterRoleBindings.items]) {
            if (!roleBinding.subjects) continue;

            for (const subject of roleBinding.subjects) {
                if (subject.kind !== "ServiceAccount") continue;

                const serviceAccObject = subject.namespace ?
                    namespacedObjectByName(data.serviceAccounts, subject.namespace, subject.name) :
                    objectByName(data.serviceAccounts, subject.name);
                // not all bindings have to have valid subjects
                if (serviceAccObject === undefined) continue;
                const roleObject = roleBinding.metadata?.namespace ?
                    namespacedObjectByName(data.roles, roleBinding.metadata?.namespace!, roleBinding.roleRef.name) :
                    objectByName(data.roles, roleBinding.roleRef.name);

                graph.createRelationByIds(
                    serviceAccObject.metadata?.uid!,
                    roleObject?.metadata?.uid!
                )
            }
        }
    }
} satisfies Rule;
