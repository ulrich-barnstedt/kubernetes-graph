import { GraphRelation } from "./GraphRelation.js";
import { GraphNode } from "./GraphNode.js";

export class Graph {
    private readonly nodes: Record<string, GraphNode>;
    private readonly relations: GraphRelation[];


    constructor (nodes: Record<string, GraphNode> = {}, relations: GraphRelation[] = []) {
        this.nodes = nodes;
        this.relations = relations;
    }

    static fromSerialized (data: Graph) : Graph {
        return new Graph(data.nodes, data.relations);
    }

    public getNodeById (id: string) : GraphNode {
        return this.nodes[id];
    }

    public getAllNodes () {
        return Object.values(this.nodes);
    }

    public addNodes (...nodes: GraphNode[]) {
        for (const node of nodes) {
            if (node.id in this.nodes) {
                return;
            }

            this.nodes[node.id] = node;
        }
    }

    public createRelation (from: GraphNode, to: GraphNode) : GraphRelation {
        const relation = new GraphRelation(
            from,
            to
        );
        from.outgoing.push(relation);
        to.incoming.push(relation);
        this.relations.push(relation);

        return relation;
    }

    public createRelationByIds (from: string, to: string) : GraphRelation {
        return this.createRelation(this.getNodeById(from), this.getNodeById(to));
    }

    public getAllRelations () : GraphRelation[] {
        return this.relations;
    }
}
