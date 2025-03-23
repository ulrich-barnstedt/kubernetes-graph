<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        children: Snippet;
        borderDirection: string;
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    }
    const {children, borderDirection, ...rest} : Props = $props();

    const styleString = [
        ...Object.entries(rest).map(([k, v]) => `${k}: ${v}`)
    ].join(";") + ";";
</script>

<div class="overlay-container" style="{styleString} border-{borderDirection}: 1px solid #555555;">
    {@render children()}
</div>

<style>
    .overlay-container {
        position: absolute;
        z-index: 100;
        display: flex;

        height: 100vh;
        width: fit-content;
        min-width: 25vw;
        max-width: 50vw;

        background: #111113;
        color: white;
        flex-direction: column;
    }
</style>
