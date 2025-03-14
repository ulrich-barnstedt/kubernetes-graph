import {deserialize} from "@ungap/structured-clone";
import {Graph} from "../shared/graph/Graph";
import cytoscape from "cytoscape";
import euler from 'cytoscape-euler';
import cytoscapePopper from "cytoscape-popper";
import {ColorMap, paletteDark, paletteLight} from "./colors";

const getCurrentGraph = async () : Promise<Graph> => {
    const apiResponse = await fetch("/graph");
    const json = await apiResponse.json();

    return Graph.fromSerialized(deserialize(json));
}

const preprocessData = (graph: Graph) : {data: any}[] => {
    const elements = [];
    const kindColorMap = new ColorMap(paletteLight);
    const namespaceColorMap = new ColorMap(paletteDark);
    namespaceColorMap.defineFixedColor("", "#ffffff");

    for (const node of graph.getAllNodes()) {
        elements.push({
            data: {
                name: node.kubeObj.metadata?.name!,
                nodeColor: kindColorMap.getColor(node.kind),
                ...node
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

(async () => {
    const apiGraph = await getCurrentGraph();
    const transformedData = preprocessData(apiGraph);

    // const noneList = [];
    // for (const node of apiGraph.getAllNodes()) {
    //     if (node.outgoing.length === 0 && node.incoming.length === 0) {
    //         noneList.push(node);
    //     }
    // }
    // console.log(noneList);

    cytoscape.use(euler);
    // cytoscape.use(cytoscapePopper(tippyFactory));

    const cy = cytoscape({
        container: document.getElementById('container'),
        elements: transformedData,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': 'data(nodeColor)',
                    label: 'data(name)',
                    color: "white",
                }
            },
            {
                selector: "edge",
                style: {
                    "line-color": "data(linkColor)"
                }
            }
        ],
        layout: {
            name: "euler",
            maxIterations: 4000,
            maxSimulationTime: 4000,
            springLength: _ => 120,
            mass: node => {
                const data = node.data();
                const connections = data.incoming.length + data.outgoing.length;
                const mass =
                    ((connections === 0 ? 1 : connections) * 5) +
                    (data.name.length * 0.5);

                // WARNING: returning 0 will cause INFNITE ram usage
                return mass > 0 ? mass : 1;
            }
        },
        wheelSensitivity: 0.3,
        autoungrabify: true,
        autounselectify: true,
        renderer: {
            webgl: true,
            // showFps: true
        }
    });

    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        const data = node.data();

        // TODO
    });
})();
