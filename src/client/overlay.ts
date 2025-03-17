import cytoscape from "cytoscape";
import hljs from 'highlight.js/lib/core';
import yamlHighlight from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/atom-one-dark.css';
import YAML from "yaml";

hljs.registerLanguage('yaml', yamlHighlight);

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
        overlay.style.display = "flex";

        const data = node.data();
        const highlightedYAML = hljs.highlight(
            YAML.stringify({
                ...data.kubeObj,
                metadata: undefined
            }),
            {language: "yaml"}
        );

        overlayContent.innerHTML = highlightedYAML.value;
        overlayHeader.innerHTML = `<b>${data.name}</b>\n  ${data.kind}\n  ${data.id}`;
    })
}
