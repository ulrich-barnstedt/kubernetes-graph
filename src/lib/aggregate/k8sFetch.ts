import {type KubernetesListObject} from "@kubernetes/client-node";
import {kube} from "$lib/aggregate/k8sClient";
import type {AwaitedValuesRecord, ExecutedFunctionsRecord, PromiseValuesRecord, ValueOf} from "$lib/typeHelpers";

type DataFetcher = () => Promise<KubernetesListObject<any>>;
export const supportedObjectTypes = {
    deployments: () => kube.apps.listDeploymentForAllNamespaces(),
    pods: () => kube.core.listPodForAllNamespaces(),
    nodes: () => kube.core.listNode(),
    namespaces: () => kube.core.listNamespace(),
    services: () => kube.core.listServiceForAllNamespaces(),
    serviceAccounts: () => kube.core.listServiceAccountForAllNamespaces(),
    replicationControllers: () => kube.core.listReplicationControllerForAllNamespaces(),
    replicaSets: () => kube.apps.listReplicaSetForAllNamespaces(),
    endpoints: () => kube.core.listEndpointsForAllNamespaces(),
    statefulSets: () => kube.apps.listStatefulSetForAllNamespaces(),
    daemonSets: () => kube.apps.listDaemonSetForAllNamespaces(),
    jobs: () => kube.batch.listJobForAllNamespaces(),
    roles: () => kube.rbac.listRoleForAllNamespaces(),
    roleBindings: () => kube.rbac.listRoleBindingForAllNamespaces(),
    clusterRoles: () => kube.rbac.listClusterRole(),
    clusterRoleBindings: () => kube.rbac.listClusterRoleBinding()
} satisfies Record<string, DataFetcher>;
export type ClusterData = AwaitedValuesRecord<ExecutedFunctionsRecord<typeof supportedObjectTypes>>;

export const defaultObjectTypes: (keyof ClusterData)[] = [
    "deployments",
    "pods",
    "nodes",
    "namespaces",
    "services",
    "replicationControllers",
    "replicaSets"
]

const parallelizePromises = async <T extends PromiseValuesRecord> (obj: T): Promise<AwaitedValuesRecord<T>> => {
    const [keys, promises] = Object.entries(obj).reduce<[(keyof T)[], Promise<ValueOf<T>>[]]>((acc, val) => {
        acc[0].push(val[0]);
        acc[1].push(val[1]);

        return acc;
    }, [[], []]);

    const results = await Promise.all(promises);
    return Object.fromEntries(
        keys.map(
            (k, idx) => [k, results[idx]]
        )
    ) as AwaitedValuesRecord<T>;
}

export const fetchClusterData = async (requestedEndpoints: (keyof ClusterData)[]) : Promise<Partial<ClusterData>> => {
    const data = Object.fromEntries(
        requestedEndpoints
            .filter(k => k in supportedObjectTypes)
            .map(k => [k, supportedObjectTypes[k]()])
    );
    return await parallelizePromises(data);
}
