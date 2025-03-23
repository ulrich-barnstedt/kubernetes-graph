import cytoscape, {type NodeSingular} from "cytoscape";
import euler, {type EulerLayoutOptions} from 'cytoscape-euler';
import {preprocessData} from "./preprocess";
import {aggregate, getObjectTypes, getRules} from "./apiHelper";

export const setupCytoscape = async (containerElement: HTMLElement) : Promise<cytoscape.Core> => {
    const rules = await getRules();
    const objectTypes = await getObjectTypes();
    const apiGraph = await aggregate({
        objectTypes: objectTypes.available,
        rules: rules.available,
        namespace: "default"
    });
    // TODO: add warning to GUI that namespacing does not affect some types

    // TODO: implement new filtering system from GUI
    const transformedData = preprocessData(apiGraph, []);

    cytoscape.use(euler);
    return cytoscape({
        container: containerElement,
        elements: transformedData,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': 'data(nodeColor)',
                    label: 'data(name)',
                    color: "white",
                    height: "data(height)",
                    width: "data(width)",
                }
            },
            {
                selector: "label",
                style: {
                    "text-outline-color": "#222225",
                    "text-outline-opacity": 1,
                    "text-outline-width": "2px",
                    "font-family": "monospace"
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
            springLength: () => 120,
            mass: (node: NodeSingular) => {
                const data = node.data();
                const connections = data.incoming.length + data.outgoing.length;
                const mass =
                    ((connections === 0 ? 1 : connections) * 8) +
                    (data.name.length * 0.5);

                // WARNING: returning 0 will cause INFINITE ram usage
                return mass > 0 ? mass : 1;
            }
        } as EulerLayoutOptions,
        wheelSensitivity: 0.3,
        autoungrabify: true,
        autounselectify: true,
        // @ts-ignore
        renderer: {
            webgl: true,
            // showFps: true
        }
    });
}
