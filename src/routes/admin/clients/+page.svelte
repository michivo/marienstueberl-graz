<script lang="ts">
	import { onMount } from 'svelte';
	import type { Client } from '../../../types/client';
	import { addClient, deleteClient, getClients, updateClient } from '../../../services/clients';
	import IconButton from '../../../components/misc/IconButton.svelte';
	import EditIcon from '../../../components/icons/EditIcon.svelte';
	import DeleteIcon from '../../../components/icons/DeleteIcon.svelte';
	import Modal from '../../../components/misc/Modal.svelte';
	import AddOrEditClientModal from '../../../components/clients/AddOrEditClientModal.svelte';

	let clients = [] as Client[];
	let showAddOrEditModal = false;
	let showDeleteModal = false;
	let currentClient = getDefaultClient();
	let loading = false;
	let isNew = false;

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

	function onCreateClient() {
		isNew = true;
		currentClient = getDefaultClient();
		showAddOrEditModal = true;
	}

	function closeClientsModal() {
		showAddOrEditModal = false;
	}

	async function saveClient() {
		loading = true;
		try {
			if(isNew) {
				await addClient(currentClient);
			}
			else {
				await updateClient(currentClient);
			}
			showAddOrEditModal = false;
			currentClient = getDefaultClient();
			loadClients();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	function onEditClient(client: Client) {
		isNew = false;
		currentClient = client;
		showAddOrEditModal = true;
	}
	
	function onDeleteClient(client: Client) {
		currentClient = client;
		showDeleteModal = true;
	}

	function cancelDelete() {
		showDeleteModal = false;
	}

	async function onConfirmDeleteClient(client: Client) {
		loading = true;
		try {
			await deleteClient(client);
			showDeleteModal = false;
			currentClient = getDefaultClient();
			loadClients();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}
</script>

<div>
	<div class="clients-container" class:blur={showAddOrEditModal}>
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Personen/Kinder</th>
					<th>Berechtigt bis</th>
					<th>Aktionen</th>
				</tr>
			</thead>
			<tbody>
				{#each clients as client}
					<tr>
						<td>{client.name}</td>
						<td>{client.email}</td>
						<td>{client.peopleCount}/{client.childrenCount}</td>
						<td>{client.validThrough}</td>
						<td class="actions-cell">
							<IconButton disabled={ loading } on:click={() => onEditClient(client)}><EditIcon /></IconButton>
							<IconButton disabled={ loading } on:click={() => onDeleteClient(client)}><DeleteIcon /></IconButton>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<button class="add-client" on:click={onCreateClient} disabled={ loading }>Klienten hinzufügen</button>

		<Modal bind:showModal={showAddOrEditModal}>
			{#snippet header()}
				<h2>
					{isNew ? 'Klienten bearbeiten' : 'Neuen Klienten anlegen'}
				</h2>
			{/snippet}
			<AddOrEditClientModal client={currentClient} {saveClient} {closeClientsModal} />
		</Modal>
		<Modal bind:showModal={showDeleteModal}>
			{#snippet header()}
				<h2>
					Klienten löschen?
				</h2>
			{/snippet}
			<div>
				Sind Sie sicher, dass Sie den Klienten '{currentClient.name}' löschen möchten? { showDeleteModal}
			</div>
			<div class="delete-buttons">
				<button class="confirm-button" on:click={() => onConfirmDeleteClient(currentClient)} disabled={ loading }>Bestätigen</button>
				<button on:click={cancelDelete} disabled={ loading }>Abbrechen</button>
			</div>
		</Modal>		
	</div>
</div>

<style scoped>
	.clients-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		table,
		button.add-client {
			width: 75%;
			min-width: 1000px;
			max-width: 100%;
			margin: 1rem;
		}

		table {
			border-bottom: 1px solid var(--secondary-dark);
			padding: 1rem;

			td,
			th {
				text-align: left;
				padding: 0.5rem;
				border-left: 1px solid var(--secondary-light);
				border-bottom: 1px solid var(--secondary-light);

				&.actions-cell {
					display: flex;
					gap: 1rem;
				}
			}
		}
	}

	.delete-buttons {
		width: 100%;
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1.5rem;

		.confirm-button {
			color: var(--highlight-red);
			border-color: var(--highlight-red);

			&:hover {
				background-color: var(--highlight-red);
				color: var(--light);
			}
		}
	}
</style>
