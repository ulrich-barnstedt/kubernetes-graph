import { GraphNode } from "./GraphNode.js";

export class GraphRelation {
    public readonly from: GraphNode;
    public readonly to: GraphNode;
    public readonly sameNamespace: boolean;

    constructor(from: GraphNode, to: GraphNode) {
        this.from = from;
        this.to = to;

        this.sameNamespace =
            this.to.kind === "V1Namespace" ||
            this.from.kind === "V1Namespace" ||
            (this.from.kubeObj.metadata?.namespace! === this.to.kubeObj.metadata?.namespace! && !!this.from.kubeObj.metadata?.namespace);
    }
}
