<script lang="ts">
    import {setupCytoscape} from "./cytoscape";
    import {onMount} from "svelte";
    import ObjectDescriptionOverlay from "$lib/overlay/ObjectDescriptionOverlay.svelte";
    import cytoscape from "cytoscape";
    import MenuOverlay from "$lib/overlay/MenuOverlay.svelte";

    let cyContainer: HTMLElement;
    let cy: cytoscape.Core;

    onMount(async () => {
        cy = await setupCytoscape(cyContainer);
    })
</script>

<MenuOverlay/>
{#if cy}
    <ObjectDescriptionOverlay cy={cy}/>
{/if}
<div class="fill" bind:this={cyContainer}></div>

<style>
    .fill {
        height: 100vh;
        width: 100vw;
        background: #222225;
    }
</style>
