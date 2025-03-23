import {type KubernetesListObject} from "@kubernetes/client-node";
import {kube} from "$lib/aggregate/k8sClient";
import type {AwaitedValuesRecord, ExecutedFunctionsRecord, PromiseValuesRecord, ValueOf} from "$lib/typeHelpers";

type DataFetcher = (namespace: string) => Promise<KubernetesListObject<any>>;
export const supportedObjectTypes = {
    deployments: (namespace) => kube.apps.listNamespacedDeployment({namespace}),
    pods: (namespace) => kube.core.listNamespacedPod({namespace}),
    nodes: () => kube.core.listNode(),
    namespaces: () => kube.core.listNamespace(),
    services: (namespace) => kube.core.listNamespacedService({namespace}),
    serviceAccounts: (namespace) => kube.core.listNamespacedServiceAccount({namespace}),
    replicationControllers: (namespace) => kube.core.listNamespacedReplicationController({namespace}),
    replicaSets: (namespace) => kube.apps.listNamespacedReplicaSet({namespace}),
    endpoints: (namespace) => kube.core.listNamespacedEndpoints({namespace}),
    statefulSets: (namespace) => kube.apps.listNamespacedStatefulSet({namespace}),
    daemonSets: (namespace) => kube.apps.listNamespacedDaemonSet({namespace}),
    jobs: (namespace) => kube.batch.listNamespacedJob({namespace}),
    roles: (namespace) => kube.rbac.listNamespacedRole({namespace}),
    roleBindings: (namespace) => kube.rbac.listNamespacedRoleBinding({namespace}),
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

export const fetchClusterData = async (requestedEndpoints: (keyof ClusterData)[], namespace: string) : Promise<Partial<ClusterData>> => {
    const data = Object.fromEntries(
        requestedEndpoints
            .filter(k => k in supportedObjectTypes)
            .map(k => [k, supportedObjectTypes[k](namespace)])
    );
    return await parallelizePromises(data);
}
