import {kube} from "../k8sClient.js";
import {
    V1ClusterRoleBindingList, V1ClusterRoleList,
    V1DaemonSetList,
    V1DeploymentList, V1EndpointsList, V1JobList,
    V1NamespaceList,
    V1NodeList,
    V1PodList, V1ReplicaSetList, V1ReplicationControllerList, V1RoleBindingList, V1RoleList,
    V1ServiceAccountList,
    V1ServiceList, V1StatefulSetList
} from "@kubernetes/client-node";

type ValueOf<T> = T[keyof T];
type PromiseValues = Record<string, Promise<any>>;
type AwaitedValues<T extends PromiseValues> = {
    [key in keyof T]: Awaited<T[key]>
}

export interface ClusterData {
    deployments: V1DeploymentList;
    pods: V1PodList;
    nodes: V1NodeList;
    namespaces: V1NamespaceList;
    services: V1ServiceList,
    serviceAccounts: V1ServiceAccountList,
    replicationControllers: V1ReplicationControllerList,
    replicaSets: V1ReplicaSetList,
    endpoints: V1EndpointsList,
    statefulSets: V1StatefulSetList,
    daemonSets: V1DaemonSetList,
    jobs: V1JobList,
    roles: V1RoleList,
    roleBindings: V1RoleBindingList,
    clusterRoles: V1ClusterRoleList,
    clusterRoleBindings: V1ClusterRoleBindingList
}

const parallelizeValues = async <T extends PromiseValues> (obj: T): Promise<AwaitedValues<T>> => {
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
    ) as AwaitedValues<T>;
}

export const fetchClusterData = async () => {
    const data: ClusterData = await parallelizeValues({
        deployments: kube.apps.listDeploymentForAllNamespaces(),
        pods: kube.core.listPodForAllNamespaces(),
        nodes: kube.core.listNode(),
        namespaces: kube.core.listNamespace(),
        services: kube.core.listServiceForAllNamespaces(),
        serviceAccounts: kube.core.listServiceAccountForAllNamespaces(),
        replicationControllers: kube.core.listReplicationControllerForAllNamespaces(),
        replicaSets: kube.apps.listReplicaSetForAllNamespaces(),
        endpoints: kube.core.listEndpointsForAllNamespaces(),
        statefulSets: kube.apps.listStatefulSetForAllNamespaces(),
        daemonSets: kube.apps.listDaemonSetForAllNamespaces(),
        jobs: kube.batch.listJobForAllNamespaces(),
        roles: kube.rbac.listRoleForAllNamespaces(),
        roleBindings: kube.rbac.listRoleBindingForAllNamespaces(),
        clusterRoles: kube.rbac.listClusterRole(),
        clusterRoleBindings: kube.rbac.listClusterRoleBinding()
    })

    return data;
}
