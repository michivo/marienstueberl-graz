<script>
	import { currentUser } from "../../stores/currentUser";
</script>

<h1>Hello { $currentUser?.displayName }, you are an { $currentUser?.role }</h1>