<script>
	import { onMount } from 'svelte';
	import FlightsSearch from '$lib/FlightsSearch.svelte';
	import FlightsIdeas from '$lib/FlightsIdeas.svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { derived } from 'svelte/store';

	// Create a writable store for the chosen destination suggestion.
	const chosenSuggestionStore = writable(null);
	// Make the store available to child components via context API.
	setContext('chosen-suggestion', chosenSuggestionStore);


	// Its being populated in onMount from Culture API of Skyscanner
	let CULTURE_RESPONSE = {
		market: '',
		locale: '',
		currency: ''
	};
	//Share the CULTURE_RESPONSE object with child components
	setContext('CULTURE_RESPONSE', CULTURE_RESPONSE);

	onMount(async () => {
    try {
        // Fetch the user's IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) {
            throw new Error('Failed to fetch IP address');
        }
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;

        // Fetch user's culture data using the IP address
        await fetchCultureData(ipAddress);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

async function fetchCultureData(ipAddress) {
    try {
        const token = localStorage.getItem('access');
        const response = await fetch(`http://localhost:8000/api/flight-culture-data/?ipAddress=${ipAddress}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch culture data');
        }

        const cultureData = await response.json();
        CULTURE_RESPONSE.market = cultureData.market;
        CULTURE_RESPONSE.locale = cultureData.locale;
        CULTURE_RESPONSE.currency = cultureData.currency;
    } catch (error) {
        console.error('Error fetching culture:', error);
    }
}

	// Create a derived store that checks if the chosen suggestion is not empty
	const isSuggestionChosen = derived(
		chosenSuggestionStore,
		($chosenSuggestionStore) => $chosenSuggestionStore !== null
	);
</script>

<div>
	<FlightsSearch />
	{#if $isSuggestionChosen}
		<FlightsIdeas />
	{/if}
</div>
