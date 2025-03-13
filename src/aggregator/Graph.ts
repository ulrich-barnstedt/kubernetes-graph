import {KubernetesObject} from "@kubernetes/client-node";

export class Node {
    public readonly id: string;
    public readonly kind: string;
    public readonly kubeObj: KubernetesObject;
    public readonly outgoing: Relation[];
    public readonly incoming: Relation[];

    constructor (kubeObj: KubernetesObject) {
        this.kubeObj = kubeObj;
        this.id = kubeObj.metadata.uid;
        this.kind = kubeObj.constructor.name;

        this.incoming = [];
        this.outgoing = [];
    }
}

export class Relation {
    public readonly from: Node;
    public readonly to: Node;

    constructor(from: Node, to: Node) {
        this.from = from;
        this.to = to;
    }
}

export class Graph {
    private readonly nodes: Record<string, Node>;
    private readonly relations: Relation[];

    constructor() {
        this.nodes = {};
        this.relations = [];
    }

    public getNodeById (id: string) : Node {
        return this.nodes[id];
    }

    public getAllNodes () {
        return Object.values(this.nodes);
    }

    public addNodes (...nodes: Node[]) {
        for (const node of nodes) {
            if (node.id in this.nodes) {
                return;
            }

            this.nodes[node.id] = node;
        }
    }

    public createRelation (from: Node, to: Node) : Relation {
        const relation = new Relation(
            from,
            to
        );
        from.outgoing.push(relation);
        to.incoming.push(relation);

        return relation;
    }

    public createRelationByIds (from: string, to: string) : Relation {
        return this.createRelation(this.getNodeById(from), this.getNodeById(to));
    }

    public getAllRelations () : Relation[] {
        return this.relations;
    }
}
