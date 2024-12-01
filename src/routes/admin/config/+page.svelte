<script lang="ts">
	import { onMount } from 'svelte';
	import {
		WEEKDAY,
		type DistributionConfig,
		type WeekDay
	} from '../../../types/distributionConfig';
	import { getUpcomingConfig, upsertConfig } from '../../../services/distributionConfig';
	import Spinner from '../../../components/misc/Spinner.svelte';
	import { getNextMonday, getPreviousMonday } from '../../../utils/dateUtils';

	let config = $state(undefined as undefined | DistributionConfig);
	let loading = $state(false);
	let showCurrentConfig = $state(false);

	let totalSlots = $derived.by(() => {
		if (!config) return 0;
		const totalHours = WEEKDAY.reduce((acc, day) => {
			if (!config || !config[day].enabled) {
				return acc;
			}
			const startHours = getHours(config[day].startTime);
			const endHours = getHours(config[day].endTime);
			if(startHours > endHours) {
				return acc;
			}
			if(isNaN(startHours) || isNaN(endHours)) {
				return acc;
			}
			return acc + (endHours - startHours);
		}, 0);
		return config.peoplePerSlot * config.timeSlotsPerHour * totalHours;
	});

	let timeRange = $derived.by(() => {
		if(!showCurrentConfig) {
			const startDay = getNextMonday();
			return formatTimeRange(startDay);
		}
		const startDay = getPreviousMonday();
		return formatTimeRange(startDay);
	});

	onMount(async () => {
		loading = true;
		try {
			config = await getUpcomingConfig();
		} finally {
			loading = false;
		}
	});

	function isEnabled(day: WeekDay) {
		if (!config) return false;
		const configDay = config[day];
		return configDay.enabled;
	}

	function getHours(timeString?: string) {
		if(!timeString) {
			return 0;
		}
		const [hours, minutes] = timeString.split(':');
		return parseInt(hours) + parseInt(minutes) / 60;
	}

	function formatTimeRange(startDate: Date) {
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 6);
		const startDay = startDate.getDate();
		const startMonth = startDate.getMonth() + 1;
		const startYear = startDate.getFullYear();
		const endDay = endDate.getDate();
		const endMonth = endDate.getMonth() + 1;
		const endYear = endDate.getFullYear();
		return `${startDay}.${startMonth}.${startYear} - ${endDay}.${endMonth}.${endYear}`;

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

	async function saveConfig(e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		if (!config || showCurrentConfig) {
			e.preventDefault();
			return;
		}
		loading = true;
		try {
			await upsertConfig(config);
			config = await getUpcomingConfig();
		} finally {
			loading = false;
		}
		e.preventDefault();
	}
</script>

<div>
	<h2>Einstellungen der Woche { timeRange }</h2>
	{#if config}
	<label for="show-upcoming">
		<input type="checkbox" id="show-upcoming" bind:checked={showCurrentConfig}> Zeige Einstellungen der aktuellen Woche
		</label>
		<form onsubmit={(e) => saveConfig(e)}>
			<h3>Wochentage mit Ausgabe</h3>
			<div class="weekdays">
				{#each WEEKDAY as day}
					<label class="day-label">
						<input
							type="checkbox"
							bind:checked={config[day].enabled}
							disabled={showCurrentConfig}
						/>
						{getDayLabel(day)}
					</label>
					<label class="time-label">
						Von:
						<input
							type="text"
							placeholder="00:00"
							bind:value={config[day].startTime}
							disabled={!isEnabled(day) || showCurrentConfig}
						/>
					</label>
					<label class="time-label"
						>Bis:
						<input
							type="text"
							placeholder="00:00"
							bind:value={config[day].endTime}
							disabled={!isEnabled(day) || showCurrentConfig}
						/>
					</label>
				{/each}
			</div>
			<div class="slot-config">
				<label class="slot-config-item"
					><span>Anzahl der Zeitslots pro Stunde:</span><input
						type="number"
						min="1"
						max="12"
						bind:value={config.timeSlotsPerHour}
						disabled={showCurrentConfig}
					/>
				</label>
				<label class="slot-config-item"
					><span>Anzahl der Familien pro Zeitslot:</span><input
						type="number"
						min="1"
						max="10"
						bind:value={config.peoplePerSlot}
						disabled={showCurrentConfig}
					/>
				</label>
				<span class="slot-summary"
					>Insgesamt können Lebensmittel an <span class="slot-count">{totalSlots} Personen</span> ausgegeben
					werden.
				</span>
			</div>
			{#if loading}
				<Spinner />
			{:else if !showCurrentConfig}
				<button class="save-button" type="submit">Speichern</button>
			{:else}
				<span class="readonly-info">
					Die Einstellungen der aktuellen Woche können nicht mehr bearbeitet werden.
				</span>
			{/if}
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

		input {
			margin-right: 0.5rem;
		}
	}

	.slot-config {
		margin-top: 2rem;
	}
	label.slot-config-item {
		margin-top: 1rem;
		display: flex;

		span {
			width: 20rem;
			font-weight: 600;
		}
		input {
			margin-left: 0.5rem;
		}
	}

	.slot-summary {
		display: block;
		margin-top: 2rem;
		font-size: 1.1rem;

		.slot-count {
			font-weight: 600;
		}
	}

	button.save-button {
		margin-top: 2rem;
		width: 35rem;
		font-size: 1.5rem;
	}

	.readonly-info {
		display: block;
		margin-top: 2rem;
		font-size: 1.25rem;
		font-weight: 600;
	}
</style>
