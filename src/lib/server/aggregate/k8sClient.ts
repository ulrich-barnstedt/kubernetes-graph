import {
    type ApiConstructor,
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

class K8sClientWrapper {
    public readonly validConfig: boolean = !!kc.getCurrentCluster();

    private createAPIClient<T extends ApiType> (target: ApiConstructor<T>): T {
        if (this.validConfig) {
            return kc.makeApiClient(target);
        } else {
            // absolute anti-pattern, but checking each property separately wouldn't be clean either
            return undefined as unknown as T;
        }
    }

    public core = this.createAPIClient(CoreV1Api);
    public apps = this.createAPIClient(AppsV1Api);
    public batch = this.createAPIClient(BatchV1Api);
    public rbac = this.createAPIClient(RbacAuthorizationV1Api);
    public extensions = this.createAPIClient(ApiextensionsV1Api);
}

export const kube = new K8sClientWrapper();
