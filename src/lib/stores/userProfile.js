import { writable } from 'svelte/store';
import { notifier } from './notifier.js';  // adjust the path according to your project structure

export const userProfile = writable({
        name: '',
		surname: '',
		country: '',
		bio: '',
		username: '',
		profile_picture: '',
		background_image: '',
		created_at: '',
		updated_at: '',
		editing: false
    }
);

export async function fetchUserProfile(uid) {
    try {
        const token = localStorage.getItem('access');
        const response = await fetch(`http://localhost:8000/api/profiles/${uid}/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const userProfileData = await response.json();
        userProfile.set(userProfileData);

        return userProfileData;

    } catch (error) {
        notifier.notify('Error', error.message, 'Error');
        return null;
    }
}