<script lang="ts">
    import {layoutConfig, setupCytoscape} from "./cytoscape";
    import {onMount} from "svelte";
    import ObjectDescriptionOverlay from "$lib/overlay/description/ObjectDescriptionOverlay.svelte";
    import cytoscape from "cytoscape";
    import MenuOverlay from "$lib/overlay/menu/MenuOverlay.svelte";
    import {preprocessData} from "./preprocess";
    import {aggregate} from "$lib/helpers/apiHelper";
    import {aggregationSpecification} from "$lib/state/aggregationSpecification.svelte";
    import type {AggregationSpec} from "../api/aggregate/+server";

    let cyContainer: HTMLElement;
    let cy: cytoscape.Core;
    let derivedSpec: AggregationSpec = $derived({
        objectTypes: aggregationSpecification.objectTypes,
        rules: aggregationSpecification.rules,
        namespace: aggregationSpecification.namespace
    })

    const updateGraph = async () => {
        const graph = await aggregate(derivedSpec);
        const transformedData = preprocessData(graph);

        cy.batch(() => {
            cy.elements().remove();
            cy.add(transformedData);
        })
        cy.layout(layoutConfig).run();
        cy.center();
    }

    onMount(async () => {
        cy = setupCytoscape(cyContainer);
    })

    $effect(() => {
        if (!aggregationSpecification.isInitialized()) return;
        updateGraph();
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
