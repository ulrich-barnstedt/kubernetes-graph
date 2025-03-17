import cytoscape from "cytoscape";
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

export const setupOverlay = (cy: cytoscape.Core) => {
    const overlay = document.getElementById("overlay")!;
    const overlayContent = document.getElementById("overlay-content")!;
    const overlayHeader = document.getElementById("overlay-header")!;

    cy.on("tap", (ev) => {
        // WebGL does not properly output nodes, therefore slowly find the correct node
        const node = Array.from(cy.nodes()).find(node => {
            const bb = node.boundingbox({includeLabels: false});

            return bb.x1 <= ev.position.x &&
                bb.x2 >= ev.position.x &&
                bb.y1 <= ev.position.y &&
                bb.y2 >= ev.position.y;
        });

        if (!node) {
            overlay.style.display = "none";
            return;
        }
        overlay.style.display = "block";

        const data = node.data();
        const highlightedJSON = hljs.highlight(
            JSON.stringify(data.kubeObj, null, 2),
            {language: "json"}
        );

        overlayContent.innerText = highlightedJSON.value;
        overlayHeader.innerText = `${data.name}\n  ${data.kind}\n  ${data.id}`;
    })
}
