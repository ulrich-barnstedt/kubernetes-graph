import k8s from "@kubernetes/client-node";

export const kubeClient = new k8s.KubeConfig();
kubeClient.loadFromDefault();

export const kubeAPI = kubeClient.makeApiClient(k8s.CoreV1Api);


/*
k8sAPI.listNamespacedPod({ namespace: 'default' }).then((res) => {
    console.log(res);
});
*/