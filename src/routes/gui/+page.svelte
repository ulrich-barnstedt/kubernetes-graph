<script lang="ts">
    import {setupCytoscape} from "./cytoscape";
    import {onMount} from "svelte";

    let cyContainer!: HTMLElement;
    onMount(() => {
        setupCytoscape(cyContainer);
    })
</script>

<!-- TODO: overlay -->
<!--<div class="overlay-container" id="overlay">-->
<!--    <pre id="overlay-header" class="overlay-header"></pre>-->
<!--    <pre class="overlay-content"><code class="language-json" id="overlay-content"></code></pre>-->
<!--</div>-->
<div class="fill" bind:this={cyContainer}></div>

<style>
    .fill {
        height: 100vh;
        width: 100vw;
        background: #222225;
    }

    .overlay-container {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 100;
        display: none;

        height: 100vh;
        width: fit-content;
        min-width: 30vw;
        max-width: 60vw;

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