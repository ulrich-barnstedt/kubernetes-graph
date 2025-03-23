<script lang="ts">
    interface Props {
        value: string[],
        options: {value: string, display: string}[]
    }
    let {options, value = $bindable()} : Props = $props();
</script>

<div>
    {#each options as option}
        <label>
            <input
                type="checkbox"
                value={option.value}
                bind:group={value}
            >

            {option.display}
        </label>
        <br/>
    {/each}
</div>

<style>
    label {
        vertical-align: top;
    }
</style>