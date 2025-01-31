
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
  
    const main = document.querySelector("#main-topic");


   

    main.classList.add("active")
    // Add click event listener to each link
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
  
        // Get the target section from data-target attribute
        const target = link.getAttribute("data-target");
  
        // Hide all sections
        sections.forEach(section => {
          section.classList.remove("active");
        });
  
        // Show the targeted section
        document.getElementById(target).classList.add("active");
      });
    });





    async function getUserData() {
      try {
          const token = localStorage.getItem('authToken'); // Correct token retrieval
          if (!token) {
              console.error("No token found. User is not authenticated.");
              return null;
          }
  
          const response = await fetch('http://localhost:5001/api/users/me', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });
  
          if (!response.ok) {
              throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          console.log(data)
          console.log("User Data Fetched:", data); // Debugging
          return data; 
          
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  }
  
  // Function to display user data
  async function displayUserData() {
      const userData = await getUserData(); // Await the promise
        
      if (userData) {
          document.getElementById("my-name").textContent = userData.fullName;
      } else {
          console.error("User data is null or undefined.");
      }
  }
  
  // Run when the page loads
  document.addEventListener("DOMContentLoaded", () => {
      displayUserData();
  });
  

  });