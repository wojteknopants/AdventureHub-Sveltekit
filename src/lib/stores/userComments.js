import { writable } from 'svelte/store';
import { notifier } from './notifier.js';  // adjust the path according to your project structure

export const userComments = writable([]);

export async function fetchUserCommentsAll(uid) {
    try {
        const token = localStorage.getItem('access');
        const response = await fetch(`http://localhost:8000/api/profiles/${uid}/comments/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const userCommentsAll = await response.json();
        userComments.set(userCommentsAll)
    } catch (error) {
        notifier.notify('Error', error.message, 'Error');
        return null;
    }
}


