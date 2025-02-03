
document.addEventListener("DOMContentLoaded", function () {
  
  const dynamicContent = document.getElementById("dynamic-content");

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

             // Save the last visited page in localStorage
      localStorage.setItem("lastPage", url);
  
        if (url.includes("user.html")) {
          loadUserScript(); // Load the user.js script dynamically
        }
  
        initEventListeners();
      })
      .catch((error) => {
        console.error("Error loading content:", error);
        dynamicContent.innerHTML =
          "<p>Failed to load content. Please try again later.</p>";
      });
  }
  
  // Function to load user.js dynamically
  function loadUserScript() {
    const script = document.createElement("script");
    script.src = "/assets/js/users.js"; // Update with the correct path
    script.onload = () => {
      initUserPage(); // Now it's available
    };
    document.body.appendChild(script);
  }
  

  loadPage("components/auth/signup.html");

  document.addEventListener("click", function (event) {
    if (event.target.id === "login") {
      event.preventDefault();
      loadPage("components/auth/login.html");
    }

    if (event.target.id === "signup") {
      event.preventDefault();
      loadPage("components/auth/signup.html");
    }


    
  });

  function initEventListeners() {
    const signUpForm = document.getElementById("signUpForm");
    if (signUpForm) {
      signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");

        try {
          const response = await fetch("http://localhost:5001/api/users/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName, email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            ("Sign-up successful! Redirecting to login...");
            loadPage("components/auth/login.html");
          } else {
            errorMessage.textContent = data.message || "Sign-up failed. Please try again.";
          }
        } catch (error) {
          console.error("Error during signup:", error);
          errorMessage.textContent = "An error occurred during sign up. Please try again.";
        }
      });
    }

    const signInForm = document.getElementById("signInForm");
    if (signInForm) {
      signInForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");

        try {
          const response = await fetch("http://localhost:5001/api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            localStorage.setItem("authToken", data.token);
            loadPage("components/user/user.html");
          } else {
            errorMessage.textContent = data.message || "Login failed. Please try again.";
          }
        } catch (error) {
          console.error("Error during login:", error);
          errorMessage.textContent = "An error occurred during login. Please try again.";
        }
      });
    }
  }
});

