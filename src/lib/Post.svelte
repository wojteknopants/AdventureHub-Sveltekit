<!-- Post.svelte -->
<script>
	import { onMount } from 'svelte';
	import CommentsList from '$lib/CommentsList.svelte';
	import PostEditing from '$lib/PostEditing.svelte';
	import { notifier } from '$lib/stores/notifier.js';

	export let post;
	export let postList;
	//export let updatePost;
	//export let toggleLikePost;
	$: editing = false;
	let displayComments = false;
	let commentsList = [];

	export async function deletePost(post) {
		try {
			const token = localStorage.getItem('access');
			const response = await fetch(`http://localhost:8000/api/posts/${post.id}/`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			// Update the postList store by filtering out the deleted post
			postList.update((posts) => posts.filter((p) => p.id !== post.id));

			notifier.notify('Success', 'Post deleted successfully', 'success');
		} catch (error) {
			notifier.notify('Error', error.message, 'error');
		}
	}

	async function toggleLikePost(post) {
		try {
			const token = localStorage.getItem('access');
			const method = post.is_liked ? 'DELETE' : 'POST';
			const response = await fetch(`http://localhost:8000/api/posts/${post.id}/like/`, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const updatedPost = await response.json(); //Receive updated post object as response

			//Version with updating just post.is_liked in a store, instead of entire post

			//postList.update((allPosts) =>
			//	allPosts.map((p) => (p.id === post.id ? { ...p, is_liked: !p.is_liked } : p))
			//);

			//Version with updating entire post object (may trigger comments refetching as well)

			postList.update((allPosts) =>
				allPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
			);

			// Send notification based on the method used (like or unlike)
			const actionNotification = method === 'POST' ? 'Liked' : 'Unliked';
			notifier.notify('Success', `${actionNotification} post successfully`, 'Success');
		} catch (error) {
			notifier.notify('Error', error.message, 'Error');
		}
	}

	export async function fetchCommentsOfPost() {
		/** This function fetches all comments of the post that is declared in local scope (Post.svelte).
		 * Call it from child component to refetch all comments fresh in Post component, so it will re-render CommentsList component
		 */
		try {
			const token = localStorage.getItem('access');
			const response = await fetch(`http://localhost:8000/api/posts/${post.id}/comments/`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			commentsList = await response.json();
			updateCommentsCountOfPost(commentsList);
			notifier.notify('Success', 'Comments fetched successfuly', 'Success');
		} catch (error) {
			notifier.notify('Error', error.message, 'Error');
			return null;
		}
	}

	function updateCommentsCountOfPost(listOfComments) {
		/** This is helper function to update comments count on Post object when refetching comments (after comment delete/create), but without need of refetching entire Post*/
		postList.update((allPosts) =>
			allPosts.map((p) => (p.id === post.id ? { ...p, comments_count: listOfComments.length } : p))
		);
	}
	function showComments() {
		//Fetch new comments only when displaying comments list, not on closing it
		if (!displayComments) {
			fetchCommentsOfPost();
		}

		displayComments = !displayComments;
	}

	function toggleEditing() {
		//Its function so I can pass it to child component PostEditing
		editing = !editing;
	}

	onMount(() => {
		fetchCommentsOfPost();
	});
</script>

<div
	class="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 my-2"
	style="background-color: #F0F0F0;"
>
	<div class="flex-auto p-6">
		<div class="flex justify-between items-start">
			<small class="text-gray-700"
				>{new Date(post.created_at).toLocaleString('en-GB', {
					hour: '2-digit',
					minute: '2-digit',
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				})}</small
			>
			<div>
				<h8 style="font-size: 0.8em;">POST #{post.id}&nbsp;</h8>
				<a href={`/profiles/${post.user}/`} style="font-size: 0.8em;"> USER ID: {post.user}</a>
			</div>
		</div>
		{#if editing}
			<!-- Include PostEditing component when editing is true -->
			<PostEditing {post} {postList} {toggleEditing} />
		{:else}
		<h5 class="text-xl font-semibold mb-1">{post.title}</h5> <!-- reduce bottom margin -->
		{#if post.tags && post.tags.length}
		  <div class="tags mb-0"> <!-- reduce bottom margin -->
			{#each post.tags as tag}
			  <span class="chip">#{tag}</span>
			{/each}
		  </div>
		{/if}

			<p class="mt-4 mb-0">{post.content}</p>

			{#if post.images}
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					{#each post.images as image (image.id)}
						<div>
							<img
								src={image.image}
								alt="Image for post {post.id}"
								class="h-auto max-w-full rounded-lg"
							/>
						</div>
					{/each}
				</div>
			{/if}
			<div class="flex justify-between items-center" style="margin-top: 20px;">
				<div>
					<button
						class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-blue-600 text-white hover:bg-blue-700"
						on:click={toggleEditing}>Edit</button
					>
					<button
						class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-red-600 text-white hover:bg-red-700"
						on:click={() => {
							deletePost(post);
						}}>Delete</button
					>
					<button
						class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700"
						on:click={showComments}
						>Comments ({post.comments_count > 99 ? '99+' : post.comments_count})</button
					>
				</div>
				<div>
					<button class="like-btn" on:click={() => toggleLikePost(post)}>
						<i class={post.is_liked ? 'fas fa-heart' : 'far fa-heart'} />
						<span>{post.likes_count}</span>
					</button>
				</div>
			</div>
			{#if displayComments}
				<CommentsList {post} {commentsList} {fetchCommentsOfPost} />
			{/if}
		{/if}
	</div>
</div>

<style>
	.like-btn {
		color: red;
		border: none;
		background: none;
		cursor: pointer;
		padding: 0;
	}

	.like-btn i,
	.like-btn span {
		color: red;
	}

	.tags {
    display: flex; /* Align tags in a row */
    flex-wrap: wrap; /* Allow wrapping if many tags */
    align-items: center; /* Center align the chips vertically */
    gap: 4px; /* This creates a small space between the chips */
    margin: 0; /* Remove any default margins */
    padding: 0; /* Remove any default padding */
  }

  .chip {
    padding: 2px 6px; /* Reduced padding for a smaller chip */
    background-color: #d0d0d0; /* Darker grey background */
    border-radius: 4px; /* Less rounded corners */
    font-size: 0.75em; /* Smaller text */
    line-height: normal; /* Default line height */
  }
</style>
