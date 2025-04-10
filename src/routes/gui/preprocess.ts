import {Graph} from "$lib/graph/Graph";
import {ColorMap, createColorIterator} from "$lib/colors";
import {iconMap, iconState} from "$lib/overlay/menu/iconMap.svelte";

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
        const multiplier = iconState.display ? 1.4 : 1;

        if (type in emphasizedTypes) {
            return {
                height: 50 * multiplier,
                width: 50 * multiplier
            };
        } else {
            return {
                height: 30 * multiplier,
                width: 30 * multiplier
            };
        }
    }

    for (const node of graph.getAllNodes()) {
        elements.push({
            data: {
                name: node.kubeObj.metadata?.name!,
                nodeColor: kindColorMap.getColor(node.kind),
                icon: iconState.display ? iconMap[node.kind] : undefined,
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
