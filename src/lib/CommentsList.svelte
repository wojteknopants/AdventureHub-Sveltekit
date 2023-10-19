<!-- CommentsList.svelte -->
<script>
    import { notifier } from '$lib/stores/notifier.js';

    import Comment from '$lib/Comment.svelte';

    export let post;
    export let commentsList;
    export let fetchCommentsOfPost;

    let newCommentField = '';

    async function addComment(post, newComment) {
		try {
			const token = localStorage.getItem('access');
			const response = await fetch(`http://localhost:8000/api/posts/${post.id}/comments/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`
				},
				body: JSON.stringify({ content: newComment })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			//const addedComment = await response.json(); not needed, will just refetch all commentsList in Post.svelte with the line below
            await fetchCommentsOfPost();
            newCommentField = '';

			notifier.notify('Success', 'Comment added successfully', 'Success');
		} catch (error) {
			notifier.notify('Error', error.message, 'Error');
		}
	}
  </script>
  
  <div class="mt-2">
    {#each commentsList as comment (comment.id)}
      <Comment {comment} {fetchCommentsOfPost} />
    {/each}
  
    <input
      type="text"
      bind:value={newCommentField}
      class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
      placeholder="Write a comment"
    />
  
    <button
      class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-green-500 text-white hover:bg-green-600"
      on:click={() => addComment(post, newCommentField)}>Comment</button>
  </div>