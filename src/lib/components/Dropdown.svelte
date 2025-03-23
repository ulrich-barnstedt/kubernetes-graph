<script lang="ts">
    interface Props {
        value: string,
        options: {value: string, display: string}[]
    }
    let {options, value = $bindable()} : Props = $props();
</script>

<select bind:value={value}>
    {#each options as option}
        <option value={option.value}>
            {option.display}
        </option>
    {/each}
</select>

<style>
    select {
        min-width: 200px;
        padding: 3px;
        border: 1px solid #555555;
        border-radius: 4px;
        background: transparent;
    }

    option {
        background: black;
    }
</style>
