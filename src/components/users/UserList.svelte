<script lang="ts">
	import { firebaseAuth } from "../../services/firebase";
	import type { UserAccount } from "../../types/userAccount";
	import DeleteIcon from "../icons/DeleteIcon.svelte";
	import EditIcon from "../icons/EditIcon.svelte";
	import IconButton from "../misc/IconButton.svelte";
    interface Props {
        users: UserAccount[];
    }

    let { users } : Props = $props();

    let loading = $state(false);

    async function makePrivileged(user: UserAccount) {
        const token = await firebaseAuth.currentUser?.getIdToken(false);
        fetch('https://setisprivilegeduser-joqt3ovt4q-ew.a.run.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ uid: user.uid })
        });
    }


	function onEditUser(user: UserAccount): void {
		throw new Error("Function not implemented.");
	}


	function onDeleteUser(user: UserAccount): void {
		throw new Error("Function not implemented.");
	}
</script>

<div>
    <table>
    <thead>
        <tr>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Zuletzt aktiv</th>
            <th>Rolle</th>
            <th>Aktionen</th>
        </tr>
    </thead>
    <tbody>
    {#each users as user}
    <tr>
        <td>{ user.displayName }</td>
        <td>{ user.email }</td>
        <td>{ user.metadata.lastSignInTime ?? ' - ' }</td>
        <td>{ user.customClaims.admin ? 'Admin' : user.customClaims.privilegedUser ? 'Helfer' : 'Klient' }</td>
        <td>							
            <IconButton disabled={ loading } on:click={() => onEditUser(user)}><EditIcon /></IconButton>
            <IconButton disabled={ loading } on:click={() => onDeleteUser(user)}><DeleteIcon /></IconButton>
        </td>
    </tr>
    {/each}
    </tbody>
    </table>
</div>

<style scoped>
table {
    max-width: 100%;
    min-width: 70%;
    width: 1000px;

    th {
        text-align: left;
    }
}
</style>