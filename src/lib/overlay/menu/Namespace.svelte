<script lang="ts">
    import Dropdown from "$lib/components/Dropdown.svelte";
    import Section from "$lib/overlay/menu/Section.svelte";
    import {specifications} from "$lib/state/specifications";

    let {selectedNamespace = $bindable()} : {selectedNamespace: string} = $props();
</script>

<Section header="Namespace">
    {#await specifications.namespaces()}
        <p>
            Loading ...
        </p>
    {:then namespaces}
        <Dropdown
            bind:value={selectedNamespace}
            options={[
                {
                    value: "",
                    display: "(all)"
                },
                ...namespaces.map(n => {
                    return {
                        value: n,
                        display: n
                    }
                })
            ]}
        />
    {/await}
</Section>
