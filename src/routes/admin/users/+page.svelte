<script lang="ts">
	import { onMount } from 'svelte';
	import { firebaseAuth } from '../../../services/firebase';
	import UserList from '../../../components/users/UserList.svelte';
	import type { UserAccount } from '../../../types/userAccount';
	import Spinner from '../../../components/misc/Spinner.svelte';
	import { getFunctionUris } from '../../../services/functionUris';
	import { page } from '$app/stores';
	import Modal from '../../../components/misc/Modal.svelte';
	import AddUserModal from '../../../components/users/AddUserModal.svelte';

	let users: UserAccount[] = $state([]);
	let allUsers: UserAccount[] = $state([]);
	let unassignedUsers: UserAccount[] = $state([]);
	let loading = $state(false);
	let error = $state('');
	let showAddModal = $state(false);
	let userAccount: UserAccount = $state(getEmptyAccount());

	onMount(loadUsers);

	function getEmptyAccount(): UserAccount {
		return {
			uid: '',
    		email: '',
    		displayName: '',
    		metadata: {
        		creationTime: '',
        		lastSignInTime: '',
    		},
    		customClaims: {
        		admin: false,
        		privilegedUser: false
    		}
		};
	}

	async function loadUsers() {
		loading = true;
		error = '';
		try {
			const token = await firebaseAuth.currentUser?.getIdToken(false);
			const response = await fetch(getFunctionUris($page.url.origin).getUsers, {
				headers: { Authorization: `Bearer ${token}` }
			});
			const responseData = await response.json();
			users = responseData.users.filter((user: UserAccount) => !!user.customClaims);
			allUsers = responseData.users;
			unassignedUsers = allUsers.filter(u => !(u.customClaims?.admin || u.customClaims?.privilegedUser));
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
	}

	function addUser() {
		userAccount = getEmptyAccount();
		showAddModal = true;
	}

	function closeUserModal() {
		showAddModal = false;
	}

	async function saveUser(newUser: UserAccount) {
		showAddModal = false;
		loading = true;
		try {
			if(newUser.customClaims?.admin) {
				await makeAdmin(newUser);
			}
			else if(newUser.customClaims?.privilegedUser) {
				await makePrivileged(newUser);
			}
			await new Promise(r => setTimeout(r, 2000)); 
			await loadUsers();
		}
		finally {
			loading = false;
		}		
	}

	
    async function makePrivileged(user: UserAccount) {
        const token = await firebaseAuth.currentUser?.getIdToken(false);
        fetch(getFunctionUris($page.url.origin).setIsPrivilegedUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ uid: user.uid })
        });
    }

	
    async function makeAdmin(user: UserAccount) {
        const token = await firebaseAuth.currentUser?.getIdToken(false);
        fetch(getFunctionUris($page.url.origin).setIsAdmin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ uid: user.uid })
        });
    }
</script>

<div>
	<h2>Benutzer:innenverwaltung</h2>
	{#if loading}
		<Spinner />
	{:else if error}
		Fehler beim Laden der Benutzer:innendaten: {error}
	{:else}
		<UserList {users} />
		<button onclick={addUser} id="add-user">Benutzer:in hinzufügen</button>
	{/if}
	<Modal bind:showModal={showAddModal}>
		{#snippet header()}
			<h2>Benutzer:in hinzufügen</h2>
		{/snippet}
		<AddUserModal user={userAccount} users={unassignedUsers} {saveUser} {closeUserModal} />
	</Modal>
</div>

<style scoped>
	#add-user {
		margin-top: 1rem;
		width: 50rem;
		max-width: 100%;
	}
</style>