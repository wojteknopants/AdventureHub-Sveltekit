<!-- PostEditing.svelte -->

<script>
	import { onMount } from 'svelte';
	import { notifier } from '$lib/stores/notifier.js';
	import PostTagSearchbox from '$lib/PostTagSearchbox.svelte';
	export let post;
	export let postList;
	export let toggleEditing;

	let changedPost = {
		title: post.title,
		content: post.content,
		tags: post.tags || [], // Initialize with existing tags if any
		newImages: [],
		imagesToDelete: []
	}; // Initializing with current data and additional fields

	function removeTag(tagToRemove) {
		changedPost.tags = changedPost.tags.filter((tag) => tag !== tagToRemove);
	}

	function handleImageDelete(imageId) {
		changedPost.imagesToDelete.push(imageId);
	}

	async function updatePost(changedPost) {
		try {
			const formData = new FormData();
			formData.append('title', changedPost.title);
			formData.append('content', changedPost.content);

			// Add new images to the FormData
			// Iterate over the selected images and append each to the FormData
			for (let i = 0; i < changedPost.newImages.length; i++) {
            formData.append('new_images', changedPost.newImages[i]);
        }

			// Add IDs of images to delete to FormData
			if (Array.isArray(changedPost.imagesToDelete)) {
			changedPost.imagesToDelete.forEach((imageId) => {
				formData.append('images_to_delete', imageId);
			});}

			// Add tags to the FormData
			if (Array.isArray(changedPost.tags)) {
			changedPost.tags.forEach((tag) => {
				formData.append('new_tags', tag);
				//console.log("logged tags");
			});}

			const token = localStorage.getItem('access');
			const response = await fetch(`http://localhost:8000/api/posts/${post.id}/`, {
				method: 'PATCH',
				headers: {
					Authorization: `JWT ${token}`
				},
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to update the post');
			}

			const updatedPost = await response.json();

			// Update the UI or state as needed
			updatedPost.showComments = false;
			updatedPost.editing = false;
			// Update store with the updated post
			postList.update((allPosts) =>
				allPosts.map((existingPost) =>
					existingPost.id === updatedPost.id ? updatedPost : existingPost
				)
			);

			// Reset changedPost after successful update
			changedPost = { ...post, newImages: [], imagesToDelete: [] };

			notifier.notify('Success', 'Post updated successfully', 'success');
		} catch (error) {
			notifier.notify('Error', error.message, 'error');
		}
	}
</script>

<div>
	<input
		type="text"
		bind:value={changedPost.title}
		class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
		placeholder="Post title"
	/>

	<PostTagSearchbox bind:tagsListToBeUpdated = {changedPost.tags} />
	
	<div class="selected-tags">
		{#each changedPost.tags as tag}
			<span class="selected-tag">
				#{tag}
				<button on:click={() => removeTag(tag)}>x</button>
			</span>
		{/each}
	</div>
	<textarea
		bind:value={changedPost.content}
		class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
		placeholder="Post content"
	/>

	<!-- Existing images with delete option -->
	{#each post.images as image}
		<div>
			<img src={image.image} alt="Post image" />
			<button on:click={() => handleImageDelete(image.id)}>Delete</button>
		</div>
	{/each}

	<div>
		<input
			type="file"
			bind:files={changedPost.newImages}
			multiple
			class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
		/>
		<small class="text-gray-700">Select up to 10 images</small>
	</div>

	<button
		class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-green-500 text-white hover:bg-green-600"
		on:click={() => {
			toggleEditing();
			updatePost(changedPost);
		}}>Save</button
	>
	<button
		class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700"
		on:click={() => {
			toggleEditing();
		}}>Cancel</button
	>
</div>

<style>
	.selected-tags{
		display: flex; /* Align tags in a row */
    flex-wrap: wrap; /* Allow wrapping if many tags */
    align-items: center; /* Center align the chips vertically */
    gap: 4px; /* This creates a small space between the chips */
    margin: 0; /* Remove any default margins */
    padding: 0; /* Remove any default padding */
	}

    .selected-tag {
        /* Style for selected tag chips with 'x' button */
        padding: 2px 6px;
        background-color: #d0d0d0;
        border-radius: 4px;
        font-size: 0.75em;
        line-height: normal;
    }

    .selected-tag button {
        /* Style for the 'x' button to remove a tag */
        margin-left: 4px;
        border: none;
        background-color: transparent;
        cursor: pointer;
    }


</style>
