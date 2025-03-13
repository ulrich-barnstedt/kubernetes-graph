import { GraphNode } from "./GraphNode.js";

export class GraphRelation {
    public readonly from: GraphNode;
    public readonly to: GraphNode;

    constructor(from: GraphNode, to: GraphNode) {
        this.from = from;
        this.to = to;
    }
}
