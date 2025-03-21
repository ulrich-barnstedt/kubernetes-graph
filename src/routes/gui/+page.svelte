<script lang="ts">
    import {setupCytoscape} from "./cytoscape";
    import {onMount} from "svelte";
    import Overlay from "$lib/overlay/Overlay.svelte";
    import cytoscape from "cytoscape";

    let cyContainer: HTMLElement;
    let cy: cytoscape.Core;

    onMount(async () => {
        cy = await setupCytoscape(cyContainer);
    })
</script>

{#if cy}
    <Overlay cy={cy}/>
{/if}
<div class="fill" bind:this={cyContainer}></div>

<style>
    .fill {
        height: 100vh;
        width: 100vw;
        background: #222225;
    }
</style>
