<script lang="ts">
    import OverlayContainer from "$lib/overlay/OverlayContainer.svelte";
    import Namespace from "$lib/overlay/menu/Namespace.svelte";
    import Rules from "$lib/overlay/menu/Rules.svelte";
    import ObjectTypes from "$lib/overlay/menu/ObjectTypes.svelte";
    import {aggregationSpecification} from "$lib/state/aggregationSpecification.svelte";
    import {forcedUpdatePropagator} from "$lib/state/forcedUpdatePropagator";
    import Section from "$lib/overlay/menu/Section.svelte";

    let visible = $state(false);
</script>

<button class="show-button borderless-button" onclick={() => visible = true}>
    Show menu
</button>
{#if visible}
    <OverlayContainer borderDirection="right" left={0} top={0}>
        <button class="hide-button borderless-button" onclick={() => visible = false}>
            Hide menu
        </button>
        <div class="content">
            <div>
                <Namespace bind:selectedNamespace={aggregationSpecification.namespace}/>
                <ObjectTypes bind:selectedObjectTypes={aggregationSpecification.objectTypes}/>
                <Rules bind:selectedRules={aggregationSpecification.rules}/>

                <Section header="Actions">
                    <button class="border-button" onclick={() => forcedUpdatePropagator.run()}>
                        Force update graph
                    </button>
                </Section>
            </div>
        </div>
    </OverlayContainer>
{/if}

<style>
    .content {
        padding: 10px 30px 10px 20px;
        overflow-y: auto;
    }

    .border-button {
        background: transparent;
        border: 1px solid #555555;
        padding: 4px 10px;
        border-radius: 4px;
    }
    .border-button:hover {
        background: #222225;
    }

    .borderless-button {
        background: transparent;
        border: none;
        padding: 10px 20px;
    }
    .show-button {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .show-button:hover {
        background: #111113;
    }
    .hide-button:hover {
        background: #222225;
    }
</style>
