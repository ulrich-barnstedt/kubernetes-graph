<script lang="ts">
    import OverlayContainer from "$lib/overlay/OverlayContainer.svelte";

    let visible = $state(false);
</script>

<button class="showButton" onclick={() => visible = true}>
    Show menu
</button>
{#if visible}
    <OverlayContainer borderDirection="right" left={0} top={0}>
        <div>
            <button class="hideButton" onclick={() => visible = false}>
                Hide menu
            </button>
        </div>
        <div class="content">
            <p>
                Menu content
            </p>
        </div>
    </OverlayContainer>
{/if}

<style>
    p, button {
        font-family: monospace;
    }

    .content {
        padding: 10px;
    }

    button {
        background: transparent;
        border: none;
        padding: 10px;
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