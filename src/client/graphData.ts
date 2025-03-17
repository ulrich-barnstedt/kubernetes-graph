import {Graph} from "../shared/graph/Graph";
import {deserialize} from "@ungap/structured-clone";
import {ColorMap, createColorIterator} from "./colors";

export const getCurrentGraph = async () : Promise<Graph> => {
    const apiResponse = await fetch("/graph");
    const json = await apiResponse.json();

    return Graph.fromSerialized(deserialize(json));
}

export const preprocessData = (graph: Graph) : {data: any}[] => {
    const elements = [];
    const kindColorMap = new ColorMap(createColorIterator(50));
    const namespaceColorMap = new ColorMap(createColorIterator(60));
    namespaceColorMap.defineFixedColor("", "#ffffff");

    const emphasizedTypes = {
        "V1Namespace" : true,
        "V1Node" : true
    }
    const getNodeStyling = (type: string): Record<string, any> => {
        if (type in emphasizedTypes) {
            return {
                height: 50,
                width: 50
            };
        } else {
            return {
                height: 30,
                width: 30
            };
        }
    }

    for (const node of graph.getAllNodes()) {
        elements.push({
            data: {
                name: node.kubeObj.metadata?.name!,
                nodeColor: kindColorMap.getColor(node.kind),
                ...node,
                ...getNodeStyling(node.kind)
            }
        })
    }
    for (const relation of graph.getAllRelations()) {
        let isSameNamespace =
            relation.from.kubeObj.metadata?.namespace! === relation.to.kubeObj.metadata?.namespace! ||
            relation.to.kind === "V1Namespace" ||
            relation.from.kind === "V1Namespace";
        let namespace = relation.from.kubeObj.metadata?.namespace! || relation.to.kubeObj.metadata?.namespace!;

        elements.push({
            data: {
                id: relation.from.id + "+" + relation.to.id,
                source: relation.from.id,
                target: relation.to.id,
                linkColor: isSameNamespace ? namespaceColorMap.getColor(namespace) : "white"
            }
        })
    }

    return elements;
}

