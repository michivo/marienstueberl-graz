<script>
	import SoupIcon from "../icons/SoupIcon.svelte";

</script>

<header>
	<span>Bitte melden Sie sich an</span>
    <SoupIcon />
</header>

<style lang="scss" scoped>
    header {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid #000;
        align-items: center;

        :global(svg) {
            height: 2rem;
        }
    }
</style>