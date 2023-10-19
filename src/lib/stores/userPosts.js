import { writable } from 'svelte/store';
import { notifier } from './notifier.js';  // adjust the path according to your project structure

export const userPosts = writable([]);



export async function fetchUserPosts(uid) {
    try {
        const token = localStorage.getItem('access');
        const response = await fetch(`http://localhost:8000/api/profiles/${uid}/posts/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let posts = await response.json();

        userPosts.set(posts);

        return posts;

    } catch (error) {
        notifier.notify('Error', error.message, 'error');
        return null;
    }
}

export async function createPost(newPost) {
    try {
        if (newPost.new_images.length > 10) {
            notifier.notify('Error', 'You can upload a maximum of 10 images', 'error');
            return; // Exit the function
        }
        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('content', newPost.content);

        // Iterate over the selected images and append each to the FormData
        for (let i = 0; i < newPost.new_images.length; i++) {
            formData.append('new_images', newPost.new_images[i]);
        }

        const token = localStorage.getItem('access');
        const response = await fetch(`http://localhost:8000/api/posts/`, {
            method: 'POST',
            headers: {
                Authorization: `JWT ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const post = await response.json();
        post.editing = false;
        post.showComments = false;

        // Updating the store with the new post
        userPosts.update((posts) => {
            posts.unshift(post); // Add the new post at the beginning of the array
            return posts; // Return the updated array to set the store
        });

        notifier.notify('Success', 'Post created successfully', 'success');
        
    } catch (error) {
        notifier.notify('Error', error.message, 'error');
    }
}

