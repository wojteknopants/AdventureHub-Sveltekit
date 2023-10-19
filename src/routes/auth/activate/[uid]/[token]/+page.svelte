
  <script>
    
    import { page } from "$app/stores"
    const {uid, token} = $page.params

  
    const activateAccount = async () => {
        console.log(`UID: ${uid}, Token: ${token}`);

        const response = await fetch('http://localhost:8000/api/auth/users/activation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,
          token: token,
        }),
      });
  
      if (response.ok) {
        alert("Account successfully activated!");
        // You might want to redirect user to login page or homepage after successful activation.
      } else {
        alert("Account activation failed! " + uid + " " + token);
        // Handle account activation failure.
      }
    };
  </script>
  
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">Account Activation</h5>
            <p class="card-text">Click the button below to activate your account.</p>
            <button class="btn btn-primary" on:click={activateAccount}>Activate Account</button>
          </div>
        </div>
      </div>
    </div>
  </div>