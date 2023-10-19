<script>
    export let userComments;
    import Comment from '$lib/Comment.svelte';
	import { notifier } from '$lib/stores/notifier.js';
    import { Toaster } from 'svelte-french-toast';

    function BoogieWoogieFunction(){
        notifier.notify('Error', 'TODO: Reactivity here', 'Error');
    }

</script>
<Toaster/>
{#if $userComments}
    {#each $userComments as comment (comment.id)}
        <Comment {comment}  fetchCommentsOfPost={BoogieWoogieFunction}/>
    {/each}
{/if}