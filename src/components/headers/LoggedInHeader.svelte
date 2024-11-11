<script>
	import { currentUser } from '../../stores/currentUser';
	import { logOut } from '../../services/firebase';
</script>

<header>
	<span>Angemeldet als <span class="username">{$currentUser.user?.displayName}</span></span>
	<button on:click={async () => await logOut()}>Sign Out</button>
</header>

<style lang="scss" scoped>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #000;

        span {
            font-weight: 300;

            &.username {
                font-weight: 700;
            }
        }
    }
</style>