import type {Rule} from "$lib/server/aggregate/ruleType";
import type {ClusterData} from "$lib/server/aggregate/k8sFetch";
import type {Graph} from "$lib/graph/Graph";
import DaemonSetToServiceAccount from "$lib/server/aggregate/rules/DaemonSetToServiceAccount";
import NodeToPod from "$lib/server/aggregate/rules/PodToNode";
import ServiceToPod from "$lib/server/aggregate/rules/ServiceToPod";
import EndpointToAddress from "$lib/server/aggregate/rules/EndpointToAddress";
import ResolveRoleBindings from "$lib/server/aggregate/rules/ResolveRoleBinding";
import OwnerReference from "$lib/server/aggregate/rules/OwnerReference";
import PathToNamespace from "$lib/server/aggregate/rules/PathToNamespace";
import ResolveClusterRoleBinding from "$lib/server/aggregate/rules/ResolveClusterRoleBinding";

export const aggregationRules = {
    "Pod -> Node": NodeToPod,
    "DaemonSet -> ServiceAccount": DaemonSetToServiceAccount,
    "Service -> Pod": ServiceToPod,
    "Endpoint -> [Address]": EndpointToAddress,
    "ClusterRole -> ClusterRoleBinding -> [Subject]": ResolveClusterRoleBinding,
    "Role -> RoleBinding -> [Subject]": ResolveRoleBindings,
    "[*] -> [OwnerReference]": OwnerReference,
    "[*] -> [...] -> Namespace": PathToNamespace
} satisfies Record<string, Rule>;
export type AggregationRules = typeof aggregationRules;

export const defaultRules: (keyof AggregationRules)[] = [
    "Pod -> Node",
    "DaemonSet -> ServiceAccount",
    "Service -> Pod",
    "Endpoint -> [Address]",
    "ClusterRole -> ClusterRoleBinding -> [Subject]",
    "Role -> RoleBinding -> [Subject]",
    "[*] -> [OwnerReference]",
    "[*] -> [...] -> Namespace"
]

export const executeRules = async (
    data: Partial<ClusterData>,
    graph: Graph,
    rules: (keyof AggregationRules)[]
) => {
    for (const ruleName of rules) {
        if (!(ruleName in aggregationRules)) continue;

        const dataSatisfied =
            aggregationRules[ruleName].requiredData
                .reduce(
                    (acc, v) => acc && !!data[v],
                    true
                )
        if (!dataSatisfied) continue;

        // safe to cast, as it has been ensured all required data is present
        await aggregationRules[ruleName].execute(data as ClusterData, graph);
    }
}
