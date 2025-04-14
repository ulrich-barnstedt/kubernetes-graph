import {GraphNode} from "$lib/graph/GraphNode";

// fake k8s object for errors
class INTERNAL_ERROR {
    public error: any;
    public metadata: Record<string, any>;

    constructor (error: any) {
        this.error = error;
        this.metadata = {
            uid: "no-uid",
            name: "INTERNAL ERROR"
        }
    }
}

// fake node to represent errors
export class ErrorNode extends GraphNode {
    constructor (error: any) {
        super(new INTERNAL_ERROR(error));
    }
}
