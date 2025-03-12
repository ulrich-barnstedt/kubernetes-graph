import k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sAPI = kc.makeApiClient(k8s.CoreV1Api);

k8sAPI.listNamespacedPod({ namespace: 'default' }).then((res) => {
    console.log(res);
});
