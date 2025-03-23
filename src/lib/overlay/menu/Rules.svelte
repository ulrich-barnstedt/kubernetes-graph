<script lang="ts">
    import {getRules} from "$lib/helpers/apiHelper";
    import MultiSelect from "$lib/components/MultiSelect.svelte";
    import Section from "$lib/overlay/menu/Section.svelte";

    let {selectedRules = $bindable()} : {selectedRules: string[]} = $props();
    let rules = getRules();

    rules.then(r => {
        selectedRules = r.defaultSelected
    })
</script>

<Section header="Rules">
    {#await rules}
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
