import type {Rule} from "$lib/aggregate/ruleType";
import {createRoleResolver} from "$lib/aggregate/rules/utils/createRoleResolver";

export default {
    requiredData: [
        "clusterRoles",
        "clusterRoleBindings",
    ],
    execute: createRoleResolver("clusterRoleBindings")
} satisfies Rule;
