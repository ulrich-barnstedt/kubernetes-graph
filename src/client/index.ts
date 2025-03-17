import cytoscape from "cytoscape";
import euler from 'cytoscape-euler';
import {getCurrentGraph, preprocessData} from "./graphData";
import {setupOverlay} from "./overlay";

(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const apiGraph = await getCurrentGraph();
    const transformedData = preprocessData(apiGraph, (urlParams.get("hide") ?? "").split(","));

    cytoscape.use(euler);
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
            springLength: _ => 120,
            mass: node => {
                const data = node.data();
                const connections = data.incoming.length + data.outgoing.length;
                const mass =
                    ((connections === 0 ? 1 : connections) * 5) +
                    (data.name.length * 0.5);

                // WARNING: returning 0 will cause INFINITE ram usage
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

    setupOverlay(cy);
})();
