<script lang="ts">
	import { onMount } from 'svelte';
	import {
		WEEKDAY,
		type DistributionConfig,
		type WeekDay
	} from '../../../types/distributionConfig';
	import { getConfig } from '../../../services/distributionConfig';

	let config = undefined as undefined | DistributionConfig;

    onMount(async () => {
        config = await getConfig();
    });    

	function isEnabled(day: WeekDay) {
		if (!config) return false;
		const configDay = config[day];
		return configDay.enabled;
	}

	function getDayLabel(day: WeekDay) {
		switch (day) {
			case 'monday':
				return 'Montag';
			case 'tuesday':
				return 'Dienstag';
			case 'wednesday':
				return 'Mittwoch';
			case 'thursday':
				return 'Donnerstag';
			case 'friday':
				return 'Freitag';
			case 'saturday':
				return 'Samstag';
			case 'sunday':
				return 'Sonntag';
		}
	}
</script>

<div>
	<h2>Einstellungen</h2>
	{#if config}
		<form>
			<h3>Wochentage mit Ausgabe</h3>
			<div class="weekdays">
				{#each WEEKDAY as day}
					<label class="day-label"><input type="checkbox" name="monday" checked={config[day].enabled} />{getDayLabel(day)}</label>
					<label class="time-label"
						>Von: <input
							type="text"
							placeholder="00:00"
							value={config[day].startTime}
							disabled={!isEnabled(day)}
						/></label
					>
					<label class="time-label"
						>Bis: <input
							type="text"
							placeholder="00:00"
							value={config[day].endTime}
							disabled={!isEnabled(day)}
						/></label
					>
				{/each}
			</div>
		</form>
	{/if}
</div>

<style scoped>
	.weekdays {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	label {
		display: flex;
		align-items: center;

		&.time-label {
			input {
				margin-left: 1rem;
			}
		}
	}
	input {
		margin-right: 0.5rem;
	}
</style>
