<script>
	import { currentUser } from '../../stores/currentUser';
	import { logOut } from '../../services/firebase';
	import CaritasIcon from '../icons/CaritasIcon.svelte';
	import HomeIcon from '../icons/HomeIcon.svelte';
</script>

<header>
	<span>Angemeldet als <span class="username">{$currentUser.user?.displayName}</span></span>
    <div class="logo">
        <a href="..">
        <div class="large-logo">
            <CaritasIcon />
        </div>
        <div class="small-logo">
            <HomeIcon />
        </div>
        </a>
    </div>
	<button on:click={async () => await logOut()}>Abmelden</button>
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

        .logo {
            :global(svg) {
                height: 2rem;
            }

            .small-logo {
                font-size: 3rem;
                font-weight: 700;
                display: none;
                border: 1px solid var(--highlight-red);
                padding: 0 0.5rem;
                border-radius: 0.5rem;
            }

            @media screen and (width < 600px) {
                :global(.large-logo svg) {
                    display: none;
                }

                .small-logo {
                    display: block;
                }
            }
        }
    }
</style>