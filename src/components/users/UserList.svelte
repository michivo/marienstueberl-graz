<script lang="ts">
	import { firebaseAuth } from "../../services/firebase";
	import type { UserAccount } from "../../types/userAccount";
    interface Props {
        users: UserAccount[];
    }

    let { users } : Props = $props();

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
</script>

<div>
    {#each users as user}
         { user.displayName } <button onclick={() => makePrivileged(user)}>Make privileged</button>
    {/each}
</div>