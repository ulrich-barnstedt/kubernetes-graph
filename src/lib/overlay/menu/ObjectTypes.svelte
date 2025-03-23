<script lang="ts">
    import MultiSelect from "$lib/components/MultiSelect.svelte";
    import Section from "$lib/overlay/menu/Section.svelte";
    import {getObjectTypes} from "$lib/helpers/apiHelper";

    let {selectedObjectTypes = $bindable()} : {selectedObjectTypes: string[]} = $props();
    let objectTypes = getObjectTypes();

    objectTypes.then(o => {
        selectedObjectTypes = o.defaultSelected
    })
</script>

<Section header="Rules">
    {#await objectTypes}
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
