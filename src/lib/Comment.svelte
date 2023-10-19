<!-- Comment.svelte -->
<script>
    import { notifier } from '$lib/stores/notifier.js';

    export let comment;
    export let fetchCommentsOfPost;
    
    let showOptions = false;

    function toggleOptions() {
        showOptions = !showOptions;
    }


    async function deleteComment(comment) {
		try {
			const token = localStorage.getItem('access');
			const response = await fetch(`http://localhost:8000/api/comments/${comment.id}/`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			//Will just refetch all commentsList in Post.svelte with the line below
            await fetchCommentsOfPost();

			notifier.notify('Success', 'Comment deleted successfully', 'Success');
		} catch (error) {
			notifier.notify('Error', error.message, 'Error');
		}
	}

    async function toggleLikeComment(comment) {
        // First we're creating a like for comment in database, next we fetching the updated comments once again.
		try {
			const token = localStorage.getItem('access');
			const method = comment.is_liked ? 'DELETE' : 'POST';
			const response = await fetch(`http://localhost:8000/api/comments/${comment.id}/like/`, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`
				}
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

            const actionNotification = method === 'POST' ? 'Liked' : 'Unliked';
			notifier.notify('Success', `${actionNotification} comment successfully`, 'Success');
			// Now make a second request to get the updated comments and re-render CommentsList.svelte
			fetchCommentsOfPost();
		} catch (error) {
			notifier.notify('Error', error.message, 'Error');
		}
	}
  </script>
  
  <div class="comment">
    <div class="comment-header">
      <p class="date">
        {new Date(comment.created_at).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}
      </p>
      <div class="options-container"> <!-- Added this container -->
        <button class="options-button" on:click={toggleOptions}>...</button>
        {#if showOptions}
            <div class="options">
                <button on:click={() => deleteComment(comment)}>Delete</button>
            </div>
        {/if}
    </div>
    </div>
    <div class="comment-content">
      <div class="comment-text">
        <p>{comment.content}</p>
      </div>
      <button class="like-btn" on:click={() => toggleLikeComment(comment)}>
        <i class={comment.is_liked ? 'fas fa-heart' : 'far fa-heart'} />
        <span>{comment.likes_count}</span>
      </button>
    </div>
  </div>

  
  <style>
	.comment {
		padding: 10px;
		border-bottom: 1px solid #ccc;
	}

	.comment-header {
		margin-bottom: 5px;
		color: #888;
		font-size: 0.8em;
        display: flex;
        justify-content: space-between;
        align-items: center; 
	}

	.comment-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.comment-text {
		flex-grow: 1;
		overflow-wrap: break-word;
		word-wrap: break-word;
		word-break: break-all;
		max-width: 90%;
	}

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
    

    .options-button {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.5em;
        vertical-align: middle;
    }

    .options-container {
        position: relative; /* Important for containing the absolute positioned options menu */
    }

    .options {
        position: absolute;
        right: 0; /* Align to the right of the container */
        
        background-color: white;
        border: 1px solid #ccc;
        padding: 8px;
        margin-top: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    
    }
	
    </style>