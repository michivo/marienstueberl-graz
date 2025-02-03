<script>
	import GoneIcon from "../components/icons/GoneIcon.svelte";
</script>

<div class="broken-content">
	<GoneIcon />
	<h1>Diese Seite wurde mangels Interesse eingestellt</h1>
</div>

<style lang="scss">
	.broken-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	h1 {
		font-size: 5rem;
		font-weight: 100;
		text-align: center;
	}
</style>
