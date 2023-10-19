<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { notifier } from '$lib/stores/notifier.js';
	import { browser } from '$app/environment';
	import { Toaster } from 'svelte-french-toast';

	import PostList from '$lib/PostList.svelte';

	// Creating a local store for postList (not exporting so you can't import it anywhere)
	const postList = writable([]);
	
    // Needs to access token that way, otherwise it sometimes throws localStorage is not defined 
    let token = null;
	if (browser) {
		token = localStorage.getItem('access');
	}

	async function fetchPostsAll() {
		if (token) {
			try {
                //const token = localStorage.getItem('access');
				const response = await fetch(`http://localhost:8000/api/posts/`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `JWT ${token}`
					}
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const postsAll = await response.json();
				postList.set(postsAll);
				notifier.notify('Success', 'All postList fetched successfuly', 'Success');
			} catch (error) {
				notifier.notify('Error', error.message, 'Error');
				return null;
			}
		}
	}

	onMount(fetchPostsAll);
</script>
<Toaster />
<main>
    <section class="container mx-auto sm:px-4 mx-auto sm:px-4 mx-auto sm:px-4 my-5">
    <div class="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300">
    <div class="flex-auto p-6">
        <h1 class="text-2xl font-semibold text-gray-900">
            Latest posts
            
        </h1>
        <br>
        <PostList {postList} />
    </div>
    
    </div>
    </section>

	
</main>
