import type {Rule} from "$lib/aggregate/ruleType";
import {createRoleResolver} from "$lib/aggregate/rules/utils/createRoleResolver";

export default {
    requiredData: [
        "roles",
        "roleBindings",
    ],
    execute: createRoleResolver("roleBindings", "roles")
} satisfies Rule;
