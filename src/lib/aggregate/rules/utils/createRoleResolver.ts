import type {Rule} from "$lib/aggregate/ruleType";
import type {ClusterData} from "$lib/aggregate/k8sFetch";
import type {Graph} from "$lib/graph/Graph";
import {namespacedObjectByName, objectByName} from "$lib/aggregate/rules/utils/utils";
import {V1ClusterRoleBindingList, V1RoleBindingList} from "@kubernetes/client-node";
import type {ValueOf} from "$lib/typeHelpers";

type allowedDataSources = {
    [K in keyof ClusterData]: ClusterData[K] extends (V1ClusterRoleBindingList | V1RoleBindingList) ? K : never;
};

export const createRoleResolver = <T extends ValueOf<allowedDataSources>>(dataElement: T) : Rule["execute"] => {
   return function (data: ClusterData, graph: Graph) {
        for (const roleBinding of data[dataElement].items) {
            const roleObject = roleBinding.metadata?.namespace ?
                namespacedObjectByName(data.roles, roleBinding.metadata?.namespace!, roleBinding.roleRef.name) :
                objectByName(data.roles, roleBinding.roleRef.name);

            graph.createRelationByIds(
                roleObject?.metadata?.uid!,
                roleBinding.metadata?.uid!
            );

            if (!roleBinding.subjects) continue;
            for (const subject of roleBinding.subjects) {
                // TODO: support other subjects?
                if (subject.kind !== "ServiceAccount") continue;

                const subjectObject = subject.namespace ?
                    namespacedObjectByName(data.serviceAccounts, subject.namespace, subject.name) :
                    objectByName(data.serviceAccounts, subject.name);

                // not all bindings have to have valid subjects
                if (subjectObject === undefined) continue;

                graph.createRelationByIds(
                    subjectObject.metadata?.uid!,
                    roleBinding.metadata?.uid!
                )
            }
        }
    }
}