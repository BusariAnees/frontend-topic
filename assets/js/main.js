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


        if (url.includes("user.html")) {
          initUserPage(); // Initialize user-specific scripts
        }

        // Initialize event listeners after loading the page
        initEventListeners();
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






  // Function to initialize event listeners for forms
  function initEventListeners() {
    // Handle the Sign Up form submission
    const signUpForm = document.getElementById("signUpForm");
    if (signUpForm) {
      signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent form from submitting traditionally

        const fullName = document.getElementById("name").value
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");

        try {
          // Call the register API
          const response = await fetch("http://localhost:5001/api/users/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName, email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            // Success: Show success message and redirect to login
            alert("Sign-up successful! Redirecting to login...");
          const load =  loadPage("components/auth/login.html"); // Load the login page dynamically
          console.log(load)
          } else {
            // Failure: Show error message
            errorMessage.textContent =
              data.message || "Sign-up failed. Please try again.";
          }
        } catch (error) {
          console.error("Error during signup:", error);
          errorMessage.textContent =
            "An error occurred during sign up. Please try again.";
        }
      });
    }

    // Handle the Login form submission
    const signInForm = document.getElementById("signInForm");
    if (signInForm) {
      signInForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent form from submitting traditionally

        const fullName = document.getElementById("name").value
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");

        try {
          // Call the login API
          const response = await fetch("http://localhost:5001/api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName,email, password }),
          });

          const data = await response.json();
         
          console.log(data);
          if (response.ok) {
            // Success: Store the token in localStorage and redirect to user page
            const token = localStorage.setItem("authToken", data.token);
            alert("Login successful! Redirecting to your page...");
            loadPage("components/user/user.html");// Redirect to the user page
          } else {
            // Failure: Show error message
            errorMessage.textContent =
              data.message || "Login failed. Please try again.";
          }
        } catch (error) {
          console.error("Error during login:", error);
          errorMessage.textContent =
            "An error occurred during login. Please try again.";
        }




      });
    }




  }



  function initUserPage() {
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
  
    document.querySelector("#main-topic").classList.add("active");
  
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        sections.forEach(section => section.classList.remove("active"));
        document.getElementById(link.getAttribute("data-target")).classList.add("active");
      });
    });
  
    async function getUserData() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return console.error("No token found.");
  
        const response = await fetch('http://localhost:5001/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) throw new Error('Failed to fetch user data');
  
        const data = await response.json();
        console.log("User Data Fetched:", data);
        return data;
       
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    async function displayUserData() {
      const userData = await getUserData(); // Await the promise
        
      if (userData) {
          document.getElementById("my-name").textContent = userData.fullName;
          document.getElementById("name").textContent = userData.fullName.toUpperCase();

      } else {
          console.error("User data is null or undefined.");
      }
  }
  
  // Run when the page loads
 
      displayUserData();


    
  }
  

});
