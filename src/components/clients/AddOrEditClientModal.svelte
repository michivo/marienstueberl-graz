<script lang="ts">
	import type { Client } from "../../types/client";

    let { client, saveClient, closeClientsModal }: { client: Client , saveClient: (c: Client) => void, closeClientsModal: () => void } = $props();

    function doSaveClient() {
        const copy = {... client};
        saveClient(copy);
    }

</script>

<form method="dialog">
	<label for="name-input">Name</label>
	<input id="name-input" type="text" placeholder="Name" bind:value={client.name} />
	<label for="email-input">E-Mail</label>
	<input id="email-input" type="email" placeholder="E-Mail" bind:value={client.email} />
    <label for="persons-input">Personen</label>
	<input type="number" placeholder="Personen" bind:value={client.peopleCount} id="persons-input" />
    <label for="children-input">Kinder</label>
	<input type="number" placeholder="Kinder" bind:value={client.childrenCount} id="children-input" />
    <label for="deadline-input">Berechtigt bis</label>
	<input type="date" placeholder="Berechtigt bis" bind:value={client.validThrough} id="deadline-input" />
	<label for="issuer-input">Ausstellende Stelle:</label>
	<input id="issuer-input" type="text" placeholder="Aussteller" bind:value={client.issuer} />    

	<button type="submit" onclick={doSaveClient}>Speichern</button>
	<button onclick={closeClientsModal}>Abbrechen</button>
</form>

<style>
    form {
        display: grid;
    }

    label {
        font-weight: bold;
        margin-top: 1rem;
    }

    input {
        padding: 0.5rem;
        border-radius: 0.2rem;
        border: 1px solid #ccc;
    }

    button {
        margin-top: 1rem;
    }
</style>