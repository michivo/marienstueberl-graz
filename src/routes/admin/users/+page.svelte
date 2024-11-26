<script lang="ts">
	import { onMount } from "svelte";
	import { firebaseAuth } from "../../../services/firebase";

    onMount(async () => {
        const token = await firebaseAuth.currentUser?.getIdToken(false);
        const response = await fetch('https://getusers-joqt3ovt4q-ew.a.run.app', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const responseData = await response.json();
        console.log(responseData);
    });
</script>