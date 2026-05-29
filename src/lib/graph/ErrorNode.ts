import {GraphNode} from "$lib/graph/GraphNode";

// fake k8s object for errors
class INTERNAL_ERROR {
    public error: any;
    public metadata: Record<string, any>;

    constructor (error: any) {
        this.error = {...error};
        if ("body" in this.error) {
            try {
                this.error.body = JSON.parse(this.error.body);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                // not json
            }
        }

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
