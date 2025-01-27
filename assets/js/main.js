document.addEventListener("DOMContentLoaded", function () {
    const dynamicContent = document.getElementById("dynamic-content");
  
    // Function to load pages dynamically
    function loadPage(url) {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load ${url}`);
          }
          return response.text();
        })
        .then((data) => {
          dynamicContent.innerHTML = data;
        })
        .catch((error) => {
          console.error("Error loading content:", error);
          dynamicContent.innerHTML =
            "<p>Failed to load content. Please try again later.</p>";
        });
    }
  
    // Load the signup page by default
    loadPage("components/auth/signup.html");
  
    // Handle navigation for login/signup links
    document.addEventListener("click", function (event) {
      if (event.target.id === "login") {
        event.preventDefault(); // Prevent default link behavior
        loadPage("components/auth/login.html");
      }
  
      if (event.target.id === "signup") {
        event.preventDefault();  
        loadPage("components/auth/signup.html");
      }
    });
  
    // Handle the Sign Up form submission
    document.getElementById("signUpForm")?.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent form from submitting traditionally
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorMessage = document.getElementById("error-message");
  
      try {
        // Call the register API
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Success: Show success message and redirect to login
          alert('Sign-up successful! Redirecting to login...');
          window.location.href = '/login';  // Or load the login page dynamically
        } else {
          // Failure: Show error message
          errorMessage.textContent = data.message || 'Sign-up failed. Please try again.';
        }
      } catch (error) {
        console.error('Error during signup:', error);
        errorMessage.textContent = 'An error occurred during sign up. Please try again.';
      }
    });
  
    // Handle the Login form submission
    document.getElementById("signInForm")?.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent form from submitting traditionally
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorMessage = document.getElementById("error-message");
  
      try {
        // Call the login API
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Success: Store the token in localStorage (or sessionStorage) and redirect to user page
          localStorage.setItem('authToken', data.token);
          alert('Login successful! Redirecting to your page...');
          window.location.href = '/user';  // Or load the user page dynamically
        } else {
          // Failure: Show error message
          errorMessage.textContent = data.message || 'Login failed. Please try again.';
        }
      } catch (error) {
        console.error('Error during login:', error);
        errorMessage.textContent = 'An error occurred during login. Please try again.';
      }
    });
  });