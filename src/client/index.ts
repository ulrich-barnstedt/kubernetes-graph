import cytoscape from "cytoscape";
import euler from 'cytoscape-euler';
import {getCurrentGraph, preprocessData} from "./graphData";

(async () => {
    const apiGraph = await getCurrentGraph();
    const transformedData = preprocessData(apiGraph);

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
                    "text-outline-width": "2px"
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

    cy.on("tap", (ev) => {
        // WebGL does not properly output nodes, therefore slowly find the correct node
        const node = Array.from(cy.nodes()).find(node => {
            const bb = node.boundingbox({includeLabels: false});

            return bb.x1 <= ev.position.x &&
                bb.x2 >= ev.position.x &&
                bb.y1 <= ev.position.y &&
                bb.y2 >= ev.position.y;
        });

        console.log(node);
    })
})();
