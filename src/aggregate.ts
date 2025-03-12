import {kubeAPI} from "./k8sClient";

// TODO: collect all data, build graph + containing all data down to yaml specs

export const collectPods = async () => {
    const pods = await kubeAPI.listPodForAllNamespaces();
}
