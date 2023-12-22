<script>
	import { getContext } from 'svelte';

	let searchTerm = '';
	let suggestions = [];
	let timeout;

	const CULTURE_RESPONSE = getContext('CULTURE_RESPONSE');

	const fetchSuggestions = async () => {
		clearTimeout(timeout); // Clear any existing timeouts
		timeout = setTimeout(async () => {
			// Set a new timeout
			if (searchTerm.trim() === '') {
				suggestions = [];
				return;
			}
			const token = localStorage.getItem('access');
			const payload = {
				
					locale: CULTURE_RESPONSE.locale.code, // From the Culture API
					market: CULTURE_RESPONSE.market.code,
					searchTerm: searchTerm,
					
			};

			try {
				const response = await fetch(`http://localhost:8000/api/flight-search-suggest/`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					throw new Error(`Failed to fetch suggestions. Status: ${response.status}`);
				}

				const data = await response.json();
				suggestions = data.places; // Extract the 'places' array from the response
			} catch (error) {
				console.error('Error fetching suggestions:', error);
			}
		}, 300); // 300ms delay before making the API call
	};

	function formattedType(type) {
		return type.replace('PLACE_TYPE_', '');
	}

	function displayTitle(suggestion) {
		if (suggestion.type === 'PLACE_TYPE_AIRPORT') {
			return `${suggestion.name} (${suggestion.iataCode})`;
		} else if (suggestion.airportInformation) {
			return `${suggestion.airportInformation.name} (${suggestion.airportInformation.iataCode})`;
		}
		return suggestion.name;
	}

	function displayType(suggestion) {
		if (suggestion.airportInformation) {
			return 'AIRPORT';
		}
		return formattedType(suggestion.type);
	}

	function displaySubtitle(suggestion) {
		if (suggestion.airportInformation) {
			return `${suggestion.countryName} - ${suggestion.airportInformation.distance.value} km from ${suggestion.name}`;
		} else {
			return suggestion.countryName;
		}
	}

	// Retrieve the chosen flight store from the context.
	const chosenSuggestionStore = getContext('chosen-suggestion');
	const selectSuggestion = (suggestion) => {
		$chosenSuggestionStore = suggestion;
		console.log($chosenSuggestionStore);
		searchTerm = displayTitle(suggestion); // Update the search input with the selected suggestion
		suggestions = []; // Clear suggestions list after selection
	};

	const clearSelection = () => {
		$chosenSuggestionStore = null;
		searchTerm = '';
	};
</script>

<div class="p-6">
	<div class="mb-4 relative">
		{#if !$chosenSuggestionStore}
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Country, city or airport of departure"
				class="w-full p-2 border border-gray-300 rounded"
				on:input={fetchSuggestions}
			/>
		{:else}
			<div class="w-full p-2 border border-gray-300 rounded flex items-center">
				<div class="flex-grow">
					<div class="font-bold">{displayTitle($chosenSuggestionStore)}</div>
					<div class="text-sm text-gray-600">
						{displayType($chosenSuggestionStore)} - {displaySubtitle($chosenSuggestionStore)}
					</div>
				</div>
				<!-- Stylish 'x' icon button using tailwind -->
				<button on:click={clearSelection}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{/if}
	</div>

	<ul class="border border-gray-300 rounded divide-y">
		{#each suggestions as suggestion (suggestion.entityId)}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				class="p-2 hover:bg-gray-200 cursor-pointer"
				title={JSON.stringify(suggestion, null, 2)}
				on:click={() => selectSuggestion(suggestion)}
			>
				<div class="font-bold">{displayTitle(suggestion)}</div>
				<div class="text-sm text-gray-600">
					{displayType(suggestion)} - {displaySubtitle(suggestion)}
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
</style>
