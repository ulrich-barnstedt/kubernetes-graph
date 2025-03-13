import {AppsV1Api, BatchV1Api, CoreV1Api, KubeConfig} from "@kubernetes/client-node";

export const kc = new KubeConfig();
kc.loadFromDefault();

interface KubeClients {
    core: CoreV1Api,
    apps: AppsV1Api,
    batch: BatchV1Api
}
export const kube: KubeClients = {
    core: kc.makeApiClient(CoreV1Api),
    apps: kc.makeApiClient(AppsV1Api),
    batch: kc.makeApiClient(BatchV1Api)
}
