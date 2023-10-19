<script>
    import Post from '$lib/Post.svelte';
    import { createPost } from '$lib/stores/userPosts.js';  // Ensure correct path
    
    export let postList;  // Expected to be passed as a prop
    
    let newPost = {
        title: '',
        content: '',
        new_images: [],
        editing: false
    };

</script>

<!-- Post Creation -->
<div class="flex justify-between mb-4">
    {#if !newPost.editing}
        <button
            class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-blue-600 text-white hover:bg-blue-600"
            on:click={() => {
                newPost.editing = true;
            }}>Create Post</button>
    {/if}
</div>

{#if newPost.editing}
    <!-- Post creation form -->
    <div class="flex-auto p-6">
        <div class="flex justify-between">
            <div>
                <input
                    type="text"
                    bind:value={newPost.title}
                    class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
                    placeholder="Post title"/>
                <textarea
                    bind:value={newPost.content}
                    class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
                    placeholder="Post content"/>
                <div>
                    <input
                        type="file"
                        bind:files={newPost.new_images}
                        multiple
                        class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"/>
                    <small class="text-gray-700">Select up to 10 images</small>
                </div>
            </div>
            <div>
                <button
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-green-500 text-white hover:bg-green-600"
                    on:click={() => {
                        createPost(newPost);
                        newPost.title = '';
                        newPost.content = '';
                        newPost.editing = false;
                        newPost.new_images = [];
                    }}>Post</button>
                <button
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700"
                    on:click={() => {
                        newPost.title = '';
                        newPost.content = '';
                        newPost.editing = false;
                        newPost.new_images = [];
                    }}>Cancel</button>
            </div>
        </div>
    </div>
{/if}

<!-- Display User Posts -->
{#if $postList}
    {#each $postList as post (post.id)}
        <Post {post} {postList} />
    {/each}
{/if}
