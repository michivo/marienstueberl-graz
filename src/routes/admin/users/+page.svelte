<script lang="ts">
	import { onMount } from 'svelte';
	import { firebaseAuth } from '../../../services/firebase';
	import UserList from '../../../components/users/UserList.svelte';
	import type { UserAccount } from '../../../types/userAccount';
	import Spinner from '../../../components/misc/Spinner.svelte';

	let users: UserAccount[] = $state([]);
	let loading = $state(false);
	let error = $state('');

	onMount(async () => {
		loading = true;
		error = '';
		try {
			const token = await firebaseAuth.currentUser?.getIdToken(false);
			const response = await fetch('https://getusers-joqt3ovt4q-ew.a.run.app', {
				headers: { Authorization: `Bearer ${token}` }
			});
			const responseData = await response.json();
			users = responseData.users;
		} catch (ex) {
			if (ex instanceof Error) {
				error = ex?.message ?? 'Unbekannter Fehler';
			} else {
				error = 'Unbekannter Fehler';
			}
			console.error(ex);
		} finally {
			loading = false;
		}
	});
</script>

<div>
	<h2>Benutzer:innenverwaltung</h2>
	{#if loading}
		<Spinner />
	{:else if error}
		Fehler beim Laden der Benutzer:innendaten: {{ error }}
	{:else}
		<UserList {users} />
	{/if}
</div>
