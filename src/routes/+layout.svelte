<script>
	import '../app.postcss';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let token = null;
	
	if (browser) {
		token = localStorage.getItem('access');
	}

	function logout() {
		if (browser) {
			localStorage.removeItem('access');
			localStorage.removeItem('refresh');
		}
		token = null;
		goto('/login');
	}
</script>

<svelte:head>
	<!-- Font Awesome -->
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" rel="stylesheet" />
	<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.css" rel="stylesheet" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"></script>
</svelte:head>

{#if token}
<!-- Top Navbar -->
<nav class="bg-gray-200 p-2.5 shadow-2xl w-full fixed top-0 left-0 z-50" style="background-color: #F0F0F0; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2)">
    <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-700">
            AdventureHub
        </h1>
        <div class="flex space-x-4">
            <button 
                class="text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded" 
                on:click={() => goto('/profiles/me')}>
                My Profile
            </button>
            <button 
                class="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded" 
                on:click={logout}>
                Logout
            </button>
        </div>
    </div>
</nav>
<!-- Left Sidebar -->
<nav class="bg-gray-200 p-2.5 shadow-2xl fixed left-4 top-1/2 transform -translate-y-1/2 rounded-md z-50" style="background-color: #F0F0F0; box-shadow: 0px 5px 25px rgba(0, 0, 0, 0.2)">
    <div class="flex justify-center my-4">
	    <button class="text-gray-500 hover:text-gray-700" on:click={() => goto('/feed')} title="Feed"><i class="fas fa-newspaper text-xl"></i></button>
    </div>
    <hr class="border-t border-gray-300"/>
    <div class="flex justify-center my-4">
	    <button class="text-gray-500 hover:text-gray-700" on:click={() => goto('/search')} title="Search"><i class="fas fa-search text-xl"></i></button>
    </div>
    <hr class="border-t border-gray-300"/>
    <div class="flex justify-center my-4">
	    <button class="text-gray-500 hover:text-gray-700" on:click={() => goto('/generate-travel')} title="Generate Travel"><i class="fas fa-dice-five text-xl"></i></button>
    </div>
    <hr class="border-t border-gray-300"/>
    <div class="flex justify-center my-4">
	    <button class="text-gray-500 hover:text-gray-700" on:click={() => goto('/places')} title="Places"><i class="fas fa-book-atlas text-xl"></i></button>
    </div>
    <hr class="border-t border-gray-300"/>
    <div class="flex justify-center my-4">
	    <button class="text-gray-500 hover:text-gray-700" on:click={() => goto('/lfg')} title="LFG"><i class="fas fa-users text-xl"></i></button>
    </div>
</nav> 

<!-- Main Content -->
<div class="pt-12 px-4 md:pl-20">
    <slot />
</div>
{:else}

<slot />

{/if}





