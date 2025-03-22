import type {KubernetesListObject, KubernetesObject} from "@kubernetes/client-node";

export const objectByName = <T extends KubernetesObject>(
    dataSource: KubernetesListObject<T>,
    name: string
) : T | undefined => {
    return dataSource.items.find(obj => obj.metadata?.name === name);
}

export const namespacedObjectByName = <T extends KubernetesObject>(
    dataSource: KubernetesListObject<T>,
    namespace: string,
    name: string
) : T | undefined => {
    return dataSource.items.find(obj => obj.metadata?.namespace === namespace && obj.metadata?.name === name);
}
