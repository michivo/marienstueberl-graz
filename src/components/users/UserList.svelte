<script lang="ts">
	import type { UserAccount } from "../../types/userAccount";
	import DeleteIcon from "../icons/DeleteIcon.svelte";
	import EditIcon from "../icons/EditIcon.svelte";
	import IconButton from "../misc/IconButton.svelte";
    interface Props {
        users: UserAccount[];
    }

    let { users } : Props = $props();

    let loading = $state(false);

	function onEditUser(user: UserAccount): void {
		alert('Noch nicht implementiert');
	}


	function onDeleteUser(user: UserAccount): void {
		alert('Noch nicht implementiert');
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
        <td>{ user.customClaims?.admin ? 'Admin' : user.customClaims?.privilegedUser ? 'Helfer' : 'Klient' }</td>
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