<script>
  import { notifier } from '$lib/stores/notifier.js';
  
  let email = '';
  let password = '';
  let re_password = '';
  
  async function handleRegister(event) {
    event.preventDefault();
    
    if (password !== re_password) {
      notifier.notify('Error', 'Passwords do not match!', 'error');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, re_password }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }
  
      notifier.notify('Success', 'Registration successful! Please log in.', 'success');
    } catch (error) {
      console.error(error);
      notifier.notify('Error', error.message, 'error');
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        AdventureHub
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Join us on your adventure journey!
      </p>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
      <input type="hidden" name="remember" value="true" />
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            bind:value={email} 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address" />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            bind:value={password} 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password" />
        </div>
        <div>
          <label for="re_password" class="sr-only">Confirm Password</label>
          <input 
            id="re_password" 
            name="re_password" 
            type="password" 
            required 
            bind:value={re_password} 
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Confirm Password" />
        </div>
      </div>
  
      <div>
        <button 
          type="submit" 
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Register
        </button>
      </div>
    </form>
  </div>
</div>

