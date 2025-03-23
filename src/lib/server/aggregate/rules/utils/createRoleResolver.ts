import type {Rule} from "$lib/server/aggregate/ruleType";
import type {ClusterData} from "$lib/server/aggregate/k8sFetch";
import type {Graph} from "$lib/graph/Graph";
import {namespacedObjectByName, objectByName} from "$lib/server/aggregate/rules/utils/utils";
import {V1ClusterRoleBindingList, V1ClusterRoleList, V1RoleBindingList, V1RoleList} from "@kubernetes/client-node";
import type {ValueOf} from "$lib/typeHelpers";

type bindingDataSources = {
    [K in keyof ClusterData]: ClusterData[K] extends (V1ClusterRoleBindingList | V1RoleBindingList) ? K : never;
};
type roleDataSources = {
    [K in keyof ClusterData]: ClusterData[K] extends (V1ClusterRoleList | V1RoleList) ? K : never;
};

export const createRoleResolver = <TB extends ValueOf<bindingDataSources>, TR extends ValueOf<roleDataSources>>(bindingElement: TB, roleElement: TR) : Rule["execute"] => {
   return function (data: ClusterData, graph: Graph) {
        for (const roleBinding of data[bindingElement].items) {
            const roleObject = roleBinding.metadata?.namespace ?
                // @ts-ignore
                namespacedObjectByName(data[roleElement], roleBinding.metadata?.namespace!, roleBinding.roleRef.name) :
                // @ts-ignore
                objectByName(data[roleElement], roleBinding.roleRef.name);

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
