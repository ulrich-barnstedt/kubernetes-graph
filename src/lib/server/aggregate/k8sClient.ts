import {
    ApiextensionsV1Api,
    type ApiType,
    AppsV1Api,
    BatchV1Api,
    CoreV1Api,
    KubeConfig,
    RbacAuthorizationV1Api
} from "@kubernetes/client-node";

export const kc = new KubeConfig();
kc.loadFromDefault();

export const kube = {
    core: kc.makeApiClient(CoreV1Api),
    apps: kc.makeApiClient(AppsV1Api),
    batch: kc.makeApiClient(BatchV1Api),
    rbac: kc.makeApiClient(RbacAuthorizationV1Api),
    extensions: kc.makeApiClient(ApiextensionsV1Api)
} satisfies Record<string, ApiType>

export type KubeClients = typeof kube;
