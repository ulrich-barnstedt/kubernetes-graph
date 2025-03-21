<script lang="ts">
    import type cytoscape from "cytoscape";
    import YAML from "yaml";
    import Highlight from "svelte-highlight";
    import {yaml} from "svelte-highlight/languages";
    import 'highlight.js/styles/atom-one-dark.css';

    const {cy} : {cy: cytoscape.Core} = $props();
    let showOverlay = $state(false);
    let objectYAML = $state("");
    let objectName =  $state("");
    let objectKind = $state("");
    let objectId = $state("");

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
        objectYAML = YAML.stringify({
            ...data.kubeObj,
            metadata: undefined
        });
        objectName = data.name;
        objectKind = data.kind;
        objectId = data.id;
    })
</script>

<svelte:head>
    <style>
        /* force disable HL.JS adding unwanted styles */
        code.hljs {
            padding: 0 !important;
            background: rgba(0,0,0,0);
            overflow: visible !important;
        }
    </style>
</svelte:head>
{#if showOverlay}
    <div class="overlay-container">
        <div class="overlay-header">
            <b>{objectName}</b>
            <br/>
            &nbsp;&nbsp;{objectKind}
            <br/>
            &nbsp;&nbsp;{objectId}
        </div>
        <div class="overlay-content">
            <Highlight
                language={yaml}
                code={objectYAML}
            />
        </div>
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
        background: #191920;
        font-family: monospace;
    }

    .overlay-content {
        overflow: auto;
        margin: 0;
        padding: 15px 20px 20px 25px;
    }
</style>