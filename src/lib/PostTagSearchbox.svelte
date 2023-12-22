<script>

let searchQuery = '';
let tagSuggestions = [];
let searchTimeout;
export let tagsListToBeUpdated;

// Updated searchSuggest function
function searchSuggest(query) {
	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(async () => {
		try {
			const token = localStorage.getItem('access');
			const response = await fetch(
				`http://localhost:8000/api/mapbox/search-suggest/?query=${query}`,
				{
					headers: {
						Authorization: `JWT ${token}`
					}
				}
			);
			if (!response.ok) {
				throw new Error('Failed to fetch tag suggestions');
			}
			const data = await response.json();
			tagSuggestions = data['suggestions']; // Assuming the response is an array of tag objects
		} catch (error) {
			console.error('Error fetching tag suggestions:', error);
		}
	}, 300);
}

	// Function to select a tag and retrieve related tags
	async function searchRetrieve(tag) {
		try {
			const token = localStorage.getItem('access');
			const response = await fetch(
				`http://localhost:8000/api/mapbox/search-retrieve/?place_id=${tag.mapbox_id}`,
				{
					headers: {
						Authorization: `JWT ${token}`
					}
				}
			);
			if (!response.ok) {
				throw new Error('Failed to retrieve tags');
			}
			const relatedTags = await response.json(); // Assuming the response is an array of strings
			if (Array.isArray(relatedTags['tags'])) {
			relatedTags['tags'].forEach((newTag) => {
				if (!tagsListToBeUpdated.includes(newTag)) {
					tagsListToBeUpdated = [...tagsListToBeUpdated, newTag];
				}
			});}
		} catch (error) {
			console.error('Error retrieving tags:', error);
		}
		searchQuery = ''; // Clear the search input
		tagSuggestions = []; // Clear the suggestions
	}


</script>

<div>
    <input
		type="text"
		bind:value={searchQuery}
		on:input={() => searchSuggest(searchQuery)}
		class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
		placeholder="Search tags"
	/>
	<div class="tag-suggestions">
        {#each tagSuggestions as suggestion}
            <div
                class="tag-suggestion"
                on:click={() => searchRetrieve(suggestion)}
            >
                <div>{suggestion.name}</div>
                <small>{suggestion.place_formatted}</small>
            </div>
        {/each}
    </div>
</div>

<style>
        .tag-suggestions {
        /* Style for the container that shows tag suggestions */
        display: flex;
        flex-direction: column;
        max-height: 200px;
        overflow-y: auto;
    }

    .tag-suggestion {
        /* Style for individual tag suggestions */
        padding: 4px 8px;
        cursor: pointer;
    }

    .tag-suggestion:hover {
        background-color: #e0e0e0;
    }
</style>