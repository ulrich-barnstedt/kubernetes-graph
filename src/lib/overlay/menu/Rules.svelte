<script lang="ts">
    import MultiSelect from "$lib/components/MultiSelect.svelte";
    import Section from "$lib/overlay/menu/Section.svelte";
    import {specifications} from "$lib/state/specifications";

    let {selectedRules = $bindable()} : {selectedRules: string[]} = $props();
</script>

<Section header="Rules">
    {#await specifications.rules()}
        <p>
            Loading ...
        </p>
    {:then rules}
        <MultiSelect
            bind:value={selectedRules}
            options={
                rules.available.map(r => {
                    return {
                        value: r,
                        display: r
                    }
                })
            }
        />
    {/await}
</Section>
