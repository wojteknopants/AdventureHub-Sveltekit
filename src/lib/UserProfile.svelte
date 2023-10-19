<script>
    import { page } from '$app/stores';

	import { notifier } from '$lib/stores/notifier.js';
    
	import { userProfile, fetchUserProfile } from '$lib/stores/userProfile.js';

    const { uid } = $page.params;

    let editing = false;
    let localUserProfile;
    $: localUserProfile = $userProfile
    
    async function updateUserProfile(userProfileData){
		try {
			
			const token = localStorage.getItem('access');
			const response = await fetch(`http://localhost:8000/api/profiles/${uid}/`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `JWT ${token}`
				},
				body: JSON.stringify(userProfileData)
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const updatedProfile = await response.json();
            userProfile.set(updatedProfile);

			notifier.notify('Success', 'User Profile edited successfully', 'Success');
		} catch (error) {
			notifier.notify('Error', error.message, 'Error');
		}
	}

</script>

<div
    class="py-3 px-6 mb-0 bg-gray-200 border-b-1 border-gray-300 text-gray-900"
    style="background-image: url({userProfile.background_image});"
>
    <img
        src={localUserProfile.profile_picture || '/Default_Profile_Picture.png'}
        alt="Profile picture"
        class="rounded-full"
        width="150"
        height="150"
    />

    {#if editing}
        <!-- Input fields for editing profile info -->
        <div class="flex justify-between">
            <div>
                <input
                    type="text"
                    bind:value={localUserProfile.name}
                    class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
                />
                <input
                    type="text"
                    bind:value={localUserProfile.surname}
                    class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
                />
                <input
                    type="text"
                    bind:value={localUserProfile.username}
                    class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
                />
                <input
                    type="text"
                    bind:value={localUserProfile.country}
                    class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
                />
                <input
                    type="text"
                    bind:value={localUserProfile.bio}
                    class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded my-2"
                />
            </div>
            <div>
                <button
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-green-500 text-white hover:bg-green-600"
                    on:click={() => {
                        editing = false;
                        updateUserProfile(localUserProfile);
                    }}>Save</button
                >
                <button
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700"
                    on:click={() => {
                        editing = false;
                    }}>Cancel</button
                >
            </div>
        </div>
    {:else}
        <!-- Display profile info -->
        <div class="flex justify-between">
            <div>
                <h1 class="text-2xl font-bold">{localUserProfile.name} {localUserProfile.surname}</h1>
                <h3 class="text-sm mt-1">{localUserProfile.username}</h3>
                <h6 class="text-sm">Country: {localUserProfile.country}</h6>
                <small class="text-sm"
                    >Member since {new Date(localUserProfile.created_at).toLocaleDateString()}</small
                >
                <p class="mt-2">{localUserProfile.bio}</p>
            </div>
            <div>
                <button
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-blue-600 text-white hover:bg-blue-600"
                    on:click={() => {
                        editing = true;
                    }}>Edit Profile</button
                >
            </div>
        </div>
    {/if}
</div>

<style>
    /* The styles specific to the user profile component */
</style>
