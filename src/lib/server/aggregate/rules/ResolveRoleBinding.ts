import type {Rule} from "$lib/server/aggregate/ruleType";
import {createRoleResolver} from "$lib/server/aggregate/rules/utils/createRoleResolver";

export default {
    requiredData: [
        "roles",
        "roleBindings",
    ],
    execute: createRoleResolver("roleBindings", "roles")
} satisfies Rule;
