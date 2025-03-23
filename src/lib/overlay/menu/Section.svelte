<script lang="ts">
    import type {Snippet} from "svelte";

    const {children, header} : {children: Snippet, header: string} = $props();
</script>

<div>
    <p>
        {header}
    </p>
    {@render children()}
</div>

<style>
    p {
        font-weight: bold;
        margin-bottom: 10px;
    }

    div {
        margin-bottom: 32px;
    }
</style>
