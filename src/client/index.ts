import {deserialize} from "@ungap/structured-clone";
import {Graph} from "../shared/graph/Graph";
import {getColor} from "./colors";
import cytoscape from "cytoscape";
import euler from 'cytoscape-euler';
import cytoscapePopper from "cytoscape-popper";

const getCurrentGraph = async () : Promise<Graph> => {
    const apiResponse = await fetch("/graph");
    const json = await apiResponse.json();

    return Graph.fromSerialized(deserialize(json));
}

const preprocessData = (graph: Graph) : {data: any}[] => {
    const elements = [];
    const types = new Set<string>();

    for (const node of graph.getAllNodes()) {
        elements.push({
            data: {
                id: node.id,
                name: node.kubeObj.metadata?.name!,
                color: getColor(node.kind),
                kind: node.kind,
                kube: node.kubeObj
            }
        })

        types.add(node.kind);
    }
    for (const relation of graph.getAllRelations()) {
        elements.push({
            data: {
                id: relation.from.id + "+" + relation.to.id,
                source: relation.from.id,
                target: relation.to.id
            }
        })
    }

    console.log(types);
    return elements;
}

(async () => {
    const apiGraph = await getCurrentGraph();
    const transformedData = preprocessData(apiGraph);

    cytoscape.use(euler);
    // cytoscape.use(cytoscapePopper(tippyFactory));

    const cy = cytoscape({
        container: document.getElementById('container'),
        elements: transformedData,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': 'data(color)',
                    label: 'data(name)'
                }
            }
        ],
        layout: {
            name: "euler"
        },
        wheelSensitivity: 0.3,
        autoungrabify: true,
        autounselectify: true
    });

    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        const data = node.data();

        // TODO
    });
})();
