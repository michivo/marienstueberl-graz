<script>
























import { firebaseAuth } from "../../services/firebase";
	import { currentUser } from "../../stores/currentUser";

	async function makeMeAdmin() {
		console.error($currentUser);
		const token = await firebaseAuth.currentUser?.getIdToken(false);
		// const token = await $currentUser?.getIdToken(false);
		await fetch('https://setisadmin-joqt3ovt4q-ew.a.run.app', {
			headers: {
				'Authorization': 'Bearer ' + token,
			}
		});
	}
</script>

<h1>Hello { $currentUser?.displayName }, you are an { $currentUser?.role }</h1>
<button on:click={makeMeAdmin}>Magic Button</button>