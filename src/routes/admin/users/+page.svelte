<script lang="ts">
	import { onMount } from "svelte";
	import { firebaseAuth } from "../../../services/firebase";
	import UserList from "../../../components/users/UserList.svelte";
	import type { UserAccount } from "../../../types/userAccount";

    let users: UserAccount[] = [];

    onMount(async () => {
        const token = await firebaseAuth.currentUser?.getIdToken(false);
        const response = await fetch('https://getusers-joqt3ovt4q-ew.a.run.app', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const responseData = await response.json();
        users = responseData.users;
        console.log(responseData);
    });
</script>

<div>
    <h2>Benutzer:innen</h2>
    <UserList users={users} />
</div>