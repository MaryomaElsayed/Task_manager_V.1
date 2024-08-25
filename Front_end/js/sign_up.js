// Define the User class
class User {
  constructor(first_name, last_name, email, password) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
  }

  // Method to return user details (excluding password for security)
  getDetails() {
    return `First Name: ${this.first_name}, Last Name: ${this.last_name}, Email: ${this.email}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const add_User = document.getElementById("add_User");

  if (add_User) {
    add_User.addEventListener("submit", async (event) => {
      event.preventDefault();

      const first_name = document.getElementById("First_Name").value;
      const last_name = document.getElementById("Last_Name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Create a new User instance
      const user = new User(first_name, last_name, email, password);

      try {
        // Send a POST request to save the user data
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });

        if (response.ok) {
          // Assuming the response returns a JSON object with user data including user_id
          const data = await response.json();

          // Store the first name and user_id in local storage
          localStorage.setItem("first_name", data.first_name);
          localStorage.setItem("user_id", data.user_id);

          // Redirect to the dashboard page
          window.location.href = "/dashboard.html";
        } else {
          console.error('Failed to save user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
});