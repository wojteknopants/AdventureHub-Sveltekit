<!-- PostEditing.svelte -->
<script>
	import { notifier } from '$lib/stores/notifier.js';

	export let post;
	export let userPosts;
    export let toggleEditing;

	async function updatePost(post) {
		try {
			const { id, title, content } = post;
			const token = localStorage.getItem('access');
			const response = await fetch(`http://localhost:8000/api/posts/${post.id}/`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`
				},
				body: JSON.stringify({ id, title, content })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const updatedPost = await response.json();
			updatedPost.showComments = false;
			updatedPost.editing = false;
			//here update store userPosts by post.id
			userPosts.update((allPosts) =>
				allPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
			);

			notifier.notify('Success', 'Post edited successfully', 'Success');
		} catch (error) {
			notifier.notify('Error', error.message, 'Error');
		}
	}
</script>

<div>
	<input
		type="text"
		bind:value={post.title}
		class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
		placeholder="Post title"
	/>
	<textarea
		bind:value={post.content}
		class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
		placeholder="Post content"
	/>
	<button
		class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-green-500 text-white hover:bg-green-600"
		on:click={() => {
			toggleEditing();
			updatePost(post);
		}}>Save</button
	>
	<button
		class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700"
		on:click={() => {
			toggleEditing();
		}}>Cancel</button
	>
</div>
