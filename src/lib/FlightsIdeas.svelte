<script>
	import { getContext, onMount } from 'svelte';
	//import { browser } from '$app/env';

	// Retrieve the chosen suggestion store from the context.
	const chosenSuggestionStore = getContext('chosen-suggestion');
	const CULTURE_RESPONSE = getContext('CULTURE_RESPONSE');
	const SOME_API_CONFIGS = getContext('SOME_API_CONFIGS');

	// You can now reactively use the chosen suggestion in this component.
	$chosenSuggestionStore; // This will give you the current value of the store.

	let destinationCountries = {};

	async function fetchFlightOffers() {
		console.log($chosenSuggestionStore.entityId);

		const token = localStorage.getItem('access');
		const originPlace = $chosenSuggestionStore.entityId;
		const year = 2023; // hardcoded for now
		const month = 12; // hardcoded for now

		// Construct the query string
		const queryString = new URLSearchParams({
			originPlace,
			year,
			month,
			locale: CULTURE_RESPONSE.locale.code, // From the Culture API
			market: CULTURE_RESPONSE.market.code,
			currency: CULTURE_RESPONSE.currency.code,
		}).toString();

		try {
			const response = await fetch(`http://localhost:8000/api/flight-offers/?${queryString}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` }
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			destinationCountries = await response.json();
		} catch (error) {
			console.error('There has been a problem with your fetch operation:', error);
		}
	}

	onMount(() => {
		fetchFlightOffers();
	});

	let selectedCountry = null;

	function handleCardClick(countryName) {
		selectedCountry = selectedCountry === countryName ? null : countryName; // Toggle selected country
	}
</script>

<div class="container mx-auto p-4">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each Object.entries(destinationCountries) as [countryName, details]}
			<div
				class="card bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
				on:click={() => handleCardClick(countryName)}
			>
				<div class="card-header p-4 font-bold text-lg">
					{countryName}
				</div>
				<div class="card-body p-4">
					<p class="mb-2">Cheapest price: <span class="font-semibold">{details.cheapest} {CULTURE_RESPONSE.currency.code}</span></p>
					<p>
						Has direct flights: <span class="font-semibold"
							>{details.has_direct ? 'Yes' : 'No'}</span
						>
					</p>
				</div>
			</div>
			{#if selectedCountry === countryName}
				<div class="col-span-3 p-4 bg-gray-100 rounded-lg">
					{#each details.flights as flight}
						<div class="flight-bar p-2 mb-2 bg-white rounded shadow">
							<p>From {flight.origin} to {flight.destination} - {flight.price}</p>
							<p>Date: {flight.date.day}-{flight.date.month}-{flight.date.year}</p>
							<p>Price: {flight.price} {CULTURE_RESPONSE.currency.code}</p>
							<p>Carrier: {flight.carrier_name}</p>
						</div>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>
