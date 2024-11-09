<script lang="ts">
	import { onMount } from 'svelte';
	import type { Client } from '../../../types/client';
	import { addClient, getClients } from '../../../services/clients';

	let clients = [] as Client[];
	let showAddOrEditModal = false;
	let currentClient = getDefaultClient();
	let loading = false;

	onMount(async () => {
		await loadClients();
	});

	async function loadClients() {
		loading = true;
		try {
			clients = await getClients();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	function getDefaultClient(): Client {
		return {
			id: '',
			userUid: '',
			name: '',
			email: '',
			peopleCount: 0,
			childrenCount: 0,
			validThrough: new Date()
		};
	}

	function openClientsModal() {
		currentClient = getDefaultClient();
		showAddOrEditModal = true;
	}

	function closeClientsModal() {
		showAddOrEditModal = false;
	}

	function saveClient() {
		loading = true;
		try {
			addClient(currentClient);
			showAddOrEditModal = false;
			currentClient = getDefaultClient();
			loadClients();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Email</th>
				<th>Personen/Kinder</th>
				<th>Berechtigt bis</th>
			</tr>
		</thead>
		<tbody>
			{#each clients as client}
				<tr>
					<td>{client.name}</td>
					<td>{client.email}</td>
					<td>{client.peopleCount}/{client.childrenCount}</td>
					<td>{client.validThrough}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<dialog open={showAddOrEditModal}>
		<form method="dialog">
			<label for="name-input">Name</label>
			<input id="name-input" type="text" placeholder="Name" bind:value={currentClient.name} />
			<label for="email-input">E-Mail</label>
			<input id="email-input" type="email" placeholder="E-Mail" bind:value={currentClient.email} />
			<input type="number" placeholder="Personen" bind:value={currentClient.peopleCount} />
			<input type="number" placeholder="Kinder" bind:value={currentClient.childrenCount} />
			<input type="date" placeholder="Berechtigt bis" bind:value={currentClient.validThrough} />

			<button type="submit" on:click={saveClient}>Speichern</button>
			<button on:click={closeClientsModal}>Abbrechen</button>
		</form>
	</dialog>

	<button on:click={openClientsModal}>Klienten hinzufügen</button>
</div>
