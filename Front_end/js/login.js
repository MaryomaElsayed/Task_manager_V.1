document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("sign-in-form");

  if (signInForm) {
    signInForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        // Send a POST request to the sign-in endpoint
        const response = await fetch('/api/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          // Assuming the response returns user data including userId
          const data = await response.json();

          // Store the user ID in local storage
          localStorage.setItem("user_id", data.userId);

          // Redirect to the dashboard page
          window.location.href = "/dashboard.html";
        } else {
          // Handle errors (e.g., invalid credentials)
          const errorData = await response.json();
          console.error('Login failed:', errorData.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
});
