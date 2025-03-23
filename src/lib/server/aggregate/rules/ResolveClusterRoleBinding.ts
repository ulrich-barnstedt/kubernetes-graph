import type {Rule} from "$lib/server/aggregate/ruleType";
import {createRoleResolver} from "$lib/server/aggregate/rules/utils/createRoleResolver";

export default {
    requiredData: [
        "clusterRoles",
        "clusterRoleBindings",
    ],
    execute: createRoleResolver("clusterRoleBindings", "clusterRoles")
} satisfies Rule;
