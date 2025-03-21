<script lang="ts">
    import cytoscape from "cytoscape";
    import hljs from "highlight.js/lib/core";
    import YAML from "yaml";
    import "./highlighting";

    const {cy} : {cy: cytoscape.Core} = $props();
    let showOverlay = $state(false);
    let header = $state("");
    let content = $state("");

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
            showOverlay = false;
            return;
        }
        showOverlay = true;

        const data = node.data();
        const highlightedYAML = hljs.highlight(
            YAML.stringify({
                ...data.kubeObj,
                metadata: undefined
            }),
            {language: "yaml"}
        );

        content = highlightedYAML.value;
        header = `<b>${data.name}</b>\n  ${data.kind}\n  ${data.id}`;
    })
</script>

{#if showOverlay}
    <div class="overlay-container">
        <!-- TODO: find alternative for @html? -->
        <pre class="overlay-header">{@html header}</pre>
        <pre class="overlay-content"><code class="language-json">{@html content}</code></pre>
    </div>
{/if}

<style>
    .overlay-container {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 100;
        display: flex;

        height: 100vh;
        width: fit-content;
        min-width: 30vw;
        max-width: 50vw;

        background: #111113;
        color: white;
        flex-direction: column;
        border-left: 1px solid #555555;
    }

    .overlay-header {
        font-size: 15px;
        color: #61afef;
        padding: 12px 20px 12px 25px;
        margin-bottom: 15px;
        background: #191920;
    }

    .overlay-content {
        overflow: auto;
        margin: 0;
        padding: 0 20px 20px 25px;
    }
</style>