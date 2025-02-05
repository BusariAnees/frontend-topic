
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

        //  Save the last visited page
        localStorage.setItem("lastPage", url);

        //  Load user.js if user.html is visited
        if (url.includes("user.html")) {
          loadUserScript();
        }

        initEventListeners();
      })
      .catch((error) => {
        console.error("Error loading content:", error);
        dynamicContent.innerHTML =
          "<p>Failed to load content. Please try again later.</p>";
      });
  }

  //  Function to load user.js dynamically
  function loadUserScript() {
    const script = document.createElement("script");
    script.src = "/assets/js/users.js"; // Ensure the correct path
    script.onload = () => {
      if (typeof initUserPage === "function") {
        initUserPage(); // Call user.js function
      }
    };
    document.body.appendChild(script);
  }

  //  Load last visited page or default to signup.html
  const lastPage = localStorage.getItem("lastPage") || "components/auth/signup.html";
  loadPage(lastPage);

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
          // Show loading screen
          document.getElementById("loading").style.display = "block";
        
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
        
            // Fetch user data before loading the page
            const userResponse = await fetch("http://localhost:5001/api/users/me", {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            });
        
            if (userResponse.ok) {
              const userData = await userResponse.json();
              localStorage.setItem("userData", JSON.stringify(userData));
        
              // Add a slight delay for smooth transition
              setTimeout(() => {
                document.getElementById("loading").style.display = "none";
                loadPage("components/user/user.html");
              }, 500);
            } else {
              errorMessage.textContent = "Failed to retrieve user data.";
              document.getElementById("loading").style.display = "none";
            }
          } else {
            errorMessage.textContent = data.message || "Login failed. Please try again.";
          }
        } catch (error) {
          errorMessage.textContent = "An error occurred. Please try again.";
          document.getElementById("loading").style.display = "none";
        }
        
      });
    }
  }
});

