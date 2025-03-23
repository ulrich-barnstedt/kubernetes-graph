import {Graph} from "$lib/graph/Graph";
import {ColorMap, createColorIterator} from "$lib/colors";

export const preprocessData = (graph: Graph) : {data: any}[] => {
    const elements = [];
    const kindColorMap = new ColorMap(createColorIterator(40, 75));
    const namespaceColorMap = new ColorMap(createColorIterator(40, 75));
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
        let namespace = relation.from.kubeObj.metadata?.namespace! || relation.to.kubeObj.metadata?.namespace!;

        elements.push({
            data: {
                id: relation.from.id + "+" + relation.to.id,
                source: relation.from.id,
                target: relation.to.id,
                linkColor: relation.sameNamespace ? namespaceColorMap.getColor(namespace) : "white"
            }
        })
    }

    return elements;
}
