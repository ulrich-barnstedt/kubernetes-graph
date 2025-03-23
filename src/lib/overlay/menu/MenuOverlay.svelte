<script lang="ts">
    import OverlayContainer from "$lib/overlay/OverlayContainer.svelte";
    import Namespace from "$lib/overlay/menu/Namespace.svelte";
    import Rules from "$lib/overlay/menu/Rules.svelte";
    import ObjectTypes from "$lib/overlay/menu/ObjectTypes.svelte";

    let visible = $state(false);
    let namespace = $state("");
    let rules = $state([]);
    let objectTypes = $state([]);
</script>

<button class="showButton" onclick={() => visible = true}>
    Show menu
</button>
{#if visible}
    <OverlayContainer borderDirection="right" left={0} top={0}>
        <button class="hideButton" onclick={() => visible = false}>
            Hide menu
        </button>
        <div class="content">
            <div>
                <Namespace bind:selectedNamespace={namespace}/>
                <ObjectTypes bind:selectedObjectTypes={objectTypes}/>
                <Rules bind:selectedRules={rules}/>
            </div>
        </div>
    </OverlayContainer>
{/if}

<style>
    * {
        font-family: monospace;
    }

    .content {
        padding: 10px 30px 10px 20px;
        overflow-y: auto;
    }

    button {
        background: transparent;
        border: none;
        padding: 10px 20px;
    }
    .showButton {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .showButton:hover {
        background: #111113;
    }
    .hideButton:hover {
        background: #222225;
    }
</style>

