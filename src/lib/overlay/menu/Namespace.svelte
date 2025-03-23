<script lang="ts">
    import {getNamespaces} from "$lib/helpers/apiHelper";
    import Dropdown from "$lib/components/Dropdown.svelte";
    import Section from "$lib/overlay/menu/Section.svelte";

    let {selectedNamespace = $bindable()} : {selectedNamespace: string} = $props();
</script>

<Section header="Namespace">
    {#await getNamespaces()}
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
