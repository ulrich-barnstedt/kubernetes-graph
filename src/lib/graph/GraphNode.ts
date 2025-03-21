import type {KubernetesObject} from "@kubernetes/client-node";
import {GraphRelation} from "./GraphRelation.js";

export class GraphNode {
    public readonly id: string;
    public readonly kind: string;
    public readonly kubeObj: KubernetesObject;
    public readonly outgoing: GraphRelation[];
    public readonly incoming: GraphRelation[];

    constructor (kubeObj: KubernetesObject) {
        this.kubeObj = kubeObj;
        this.id = kubeObj.metadata!.uid!;
        this.kind = kubeObj.constructor.name;

        this.incoming = [];
        this.outgoing = [];
    }
}
