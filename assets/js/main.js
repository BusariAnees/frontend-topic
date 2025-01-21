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

    // Handle navigation (event delegation)
    document.addEventListener("click", function (event) {
        if (event.target.id === "login") {
            event.preventDefault(); // Prevent default link behavior
            loadPage("components/auth/login.html");
        }
    });

    document.addEventListener("click", function (event) {
        if(event.target.id === "signup"){
            event.preventDefault();  
            loadPage("components/auth/signup.html")
        }
    })
});