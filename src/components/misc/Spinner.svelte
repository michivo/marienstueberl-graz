<script lang="ts">
	export let color = '#333';
	export let unit = 'px';
	export let duration = '0.8s';
	export let size = '60';
	export let pause = false;
	let moonSize: number = +size / 7;
	let top: number = +size / 2 - moonSize / 2;
</script>

<div class="spinner-container">
	<div
		class="wrapper"
		class:pause-animation={pause}
		style="--size: {size}{unit}; --color: {color}; --moonSize: {top}{unit}; --duration: {duration};"
	>
		<div class="circle-one" class:pause-animation={pause}></div>
		<div class="circle-two" class:pause-animation={pause}></div>
	</div>
</div>

<style>
	.spinner-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.wrapper {
		height: var(--size);
		width: var(--size);
		border-radius: 100%;
		animation: moonStretchDelay var(--duration) 0s infinite linear;
		animation-fill-mode: forwards;
		position: relative;
	}
	.circle-one {
		top: var(--moonSize);
		background-color: var(--color);
		width: calc(var(--size) / 7);
		height: calc(var(--size) / 7);
		border-radius: 100%;
		animation: moonStretchDelay var(--duration) 0s infinite linear;
		animation-fill-mode: forwards;
		opacity: 0.8;
		position: absolute;
	}
	.circle-two {
		opacity: 0.1;
		border: calc(var(--size) / 7) solid var(--color);
		height: var(--size);
		width: var(--size);
		border-radius: 100%;
		box-sizing: border-box;
	}
	.pause-animation {
		animation-play-state: paused;
	}
	@keyframes moonStretchDelay {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
