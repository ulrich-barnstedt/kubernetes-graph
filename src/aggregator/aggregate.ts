import {kube} from "../k8sClient";
import {
    V1DaemonSetList,
    V1DeploymentList, V1Endpoints, V1JobList,
    V1NamespaceList,
    V1NodeList,
    V1PodList, V1ReplicaSet, V1ReplicationControllerList,
    V1ServiceAccountList,
    V1ServiceList, V1StatefulSetList
} from "@kubernetes/client-node";

export interface ClusterData {
    deployments: V1DeploymentList;
    pods: V1PodList;
    nodes: V1NodeList;
    namespaces: V1NamespaceList;
    services: V1ServiceList,
    serviceAccounts: V1ServiceAccountList,
    replicationControllers: V1ReplicationControllerList,
    replicaSets: V1ReplicaSet,
    endpoints: V1Endpoints,
    statefulSets: V1StatefulSetList,
    daemonSets: V1DaemonSetList,
    jobs: V1JobList
}

type AwaitedValues<T extends Record<string, Promise<any>>> = {
    [key in keyof T]: Awaited<T[key]>
}
const parallelizeValues = async <T extends Record<string, Promise<any>>> (obj: T): Promise<AwaitedValues<T>> => {
    const [keys, promises] = Object.entries(obj).reduce((acc, val) => {
        acc[0].push(val[0]);
        acc[1].push(val[1]);

        return acc;
    }, [[], []]);

    const results = await Promise.all(promises);
    return Object.fromEntries(keys.map(((k, idx) => [k, results[idx]])));
}

export const collectData = async () => {
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
        jobs: kube.batch.listJobForAllNamespaces()
    })

    return data;
}
