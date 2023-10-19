<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import UserProfile from '$lib/UserProfile.svelte';
	import PostList from '$lib/PostList.svelte';
	import UserComments from '$lib/UserComments.svelte';
	import { userPosts, fetchUserPosts } from '$lib/stores/userPosts.js';
	import { userComments, fetchUserCommentsAll } from '$lib/stores/userComments.js';
	import { fetchUserProfile } from '$lib/stores/userProfile.js';
	import { notifier } from '$lib/stores/notifier.js';

	import { Toaster } from 'svelte-french-toast';

	const { uid } = $page.params;


	onMount(async () => {
		try {
			await fetchUserProfile(uid);
			await fetchUserPosts(uid);
			await fetchUserCommentsAll(uid);

			notifier.notify('Success', 'Mounted succesfully!', 'Success');
		} catch (error) {
			notifier.notify('Error', error.message, 'Error');
		}
	});

	let activeTab = 'posts';  // Set default tab to 'posts'
</script>

<Toaster />

<section class="container mx-auto sm:px-4 mx-auto sm:px-4 mx-auto sm:px-4 my-5">
	<div class="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300">
		<UserProfile />

        <!-- Tabs -->
		<div class="p-6 bg-gray-100">
            <button 
                class="px-4 py-2 mr-2" 
                class:active={activeTab === 'posts'} 
                on:click={() => { activeTab = 'posts' }}>Posts</button>
            <button 
                class="px-4 py-2" 
                class:active={activeTab === 'comments'} 
                on:click={() => { activeTab = 'comments' }}>Comments</button>
		</div>

		<!-- Tab Contents -->
		<div class="flex-auto p-6">
			{#if activeTab === 'posts'}
				<PostList postList={userPosts} />
			{:else if activeTab === 'comments'}
				<UserComments {userComments} />
			{/if}
		</div>
	</div>
</section>

<style>
    button.active {
        font-weight: bold;
        border-bottom: 3px solid #4CAF50; /* Green underline */
    }
</style>