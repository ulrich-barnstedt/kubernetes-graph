<script lang="ts">
    import MultiSelect from "$lib/components/MultiSelect.svelte";
    import Section from "$lib/overlay/menu/Section.svelte";
    import {specifications} from "$lib/state/specifications";

    let {selectedObjectTypes = $bindable()} : {selectedObjectTypes: string[]} = $props();
</script>

<Section header="Object types">
    {#await specifications.objectTypes()}
        <p>
            Loading ...
        </p>
    {:then objectTypes}
        <MultiSelect
            bind:value={selectedObjectTypes}
            options={
                objectTypes.available.map(o => {
                    return {
                        value: o,
                        display: o
                    }
                })
            }
        />
    {/await}
</Section>
