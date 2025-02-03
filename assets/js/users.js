function initUserPage() {
    displayUserData();
    addProfileUpdateListener();
    initTopicForm();
    subscription ();
  
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
    document.body.classList.add("fade-in");
  
    document.querySelector("#inbox").classList.add("active");
  
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
      const userData = await getUserData();
  
      if (userData) {
        document.getElementById("my-name").textContent = userData.fullName;
        document.getElementById("name").textContent = userData.fullName.toUpperCase();
        document.getElementById("name-editing").value = userData.fullName;
        document.getElementById("email-editing").value = userData.email;
        document.getElementById("topic").value = userData.subscribedTopics;
      } else {
        console.error("User data is null or undefined.");
      }
    }
  
    function addProfileUpdateListener() {
      setTimeout(() => {
        const container = document.getElementById("container-form");
        if (!container) {
          console.error("Form container not found.");
          return;
        }
  
        container.addEventListener("submit", async (e) => {
          e.preventDefault();
          const fullName = document.getElementById("name-editing").value;
          const token = localStorage.getItem('authToken');
  
          if (!token) {
            console.error("No token found.");
            return;
          }
  
          try {
            const response = await fetch('http://localhost:5001/api/users/me', {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ fullName }),
            });
  
            const data = await response.json();
            console.log("Update Response:", data);
  
            if (response.ok) {
              loadPage("components/user/user.html");
            } else {
              const errorMessageElement = document.getElementById("error-message");
              if (errorMessageElement) {
                errorMessageElement.textContent = data.message || "Failed. Please try again.";
              }
            }
          } catch (error) {
            console.error("Error updating profile:", error);
          }
        });
      }, 500);
    }
 

    async function initTopicForm() {
      const form = document.getElementById('topicForm');
      const nameInput = document.getElementById('topic-name');
      const descriptionInput = document.getElementById('description');
      const typeInput = document.getElementById('type'); // Fix: Use the correct hidden input
      const secretIdContainer = document.getElementById('secretIdContainer');
      const secretIdInput = document.getElementById('secretId');
      const responseMessage = document.getElementById('responseMessage');
    
      // Handle form submission
      form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent page reload
    
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const type = typeInput.value.trim(); // Get value from the hidden input
        const secretId = type === 'Private' ? secretIdInput.value.trim() : null;
    
        if (!name || !type) {
          responseMessage.innerText = 'Name and Type are required.';
          return;
        }
    
        try {
          const token = localStorage.getItem('authToken');
          console.log(token)
          if (!token) return console.error("No token found.");
    
          const response = await fetch('http://localhost:5001/api/topics/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, type, secretId }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.message || 'Failed to create topic');
          }
         
    
          responseMessage.innerText = 'Topic created successfully!';
          responseMessage.style.color = 'green';
    
          form.reset(); // Clear form on success
          typeInput.value = ''; // Reset type
          secretIdContainer.style.display = 'none'; // Hide Secret ID field
        } catch (error) {
          responseMessage.innerText = `Error: ${error.message}`;
          responseMessage.style.color = 'red';
        }
      });
    }
    
    // Handle dropdown selection
    function selectOption(selectedType) {
      document.getElementById('type').value = selectedType.toLowerCase(); // Fix: Correctly set the hidden input
      document.getElementById('topics-type').innerText = `Topic's Type: ${selectedType}`;
      document.getElementById('secretIdContainer').style.display = selectedType === 'Private' ? 'block' : 'none';
    }
    
    
    window.selectOption = selectOption; // Ensure the function is globally available
    


    //searching for subscriptions

    async function subscription () {
      const searchButtons = document.querySelectorAll("#button-public");
      const secretIdInput = document.getElementById("secret-id");
      const topicNameInput = document.getElementById("topic-name");
      const searchResults = document.createElement("ul");
      searchResults.id = "search-re";
      document.getElementById("subscribe-topic").appendChild(searchResults);
  
      searchButtons.forEach(button => {
          button.addEventListener("click", async function () {
              const inputField = this.previousElementSibling;
              const searchValue = inputField.value.trim();
              
              if (!searchValue) {
                  alert("Please enter a topic name or secret ID.");
                  return;
              }
  
              try {
                const token = localStorage.getItem('authToken');
                console.log(token)
                if (!token) return console.error("No token found.");


                  const response = await fetch("http://localhost:5001/api/topics/search", {
                      method: "POST",
                      headers: {
                        'Authorization': `Bearer ${token}`,
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ name: searchValue }),
                  });
  
                  const data = await response.json();
                  
                  if (!response.ok) {
                      throw new Error(data.message || "Failed to retrieve topics.");
                  }
  
                  displaySearchResults(data.topics);
              } catch (error) {
                  console.error("Search error:", error);
                  alert(error.message);
              }
          });
      });
  
      function displaySearchResults(topics) {
          searchResults.innerHTML = ""; // Clear previous results
          if (topics.length === 0) {
              searchResults.innerHTML = "<li>No topics found.</li>";
              return;
          }
  
          topics.forEach(topic => {
            const searchResultsContainer = document.createElement("ul");
            searchResultsContainer.id = "search-results";
            document.getElementById("subscribe-topic").appendChild(searchResultsContainer);
              const li = document.createElement("li");
              li.textContent = `${topic.name}`;
              searchResultsContainer.appendChild(li);
              const p = document.createElement("p");
              p.textContent =`${topic.type}`;
              searchResultsContainer.appendChild(p);
          });
      }
  }
    

  async function subcription () {
    const searchButtons = document.querySelectorAll("#button-private");
    const secretIdInput = document.getElementById("secret-id");
    const topicNameInput = document.getElementById("topic-name");
    const searchResults = document.createElement("ul");
    searchResults.id = "search-re";
    document.getElementById("subscribe-topic").appendChild(searchResults);

    searchButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const inputField = this.previousElementSibling;
            const searchValue = inputField.value.trim();
            
            if (!searchValue) {
                alert("Please enter a topic name or secret ID.");
                return;
            }

            try {
              const token = localStorage.getItem('authToken');
              console.log(token)
              if (!token) return console.error("No token found.");


                const response = await fetch("http://localhost:5001/api/topics/private/search", {
                    method: "POST",
                    headers: {
                      'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: searchValue }),
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || "Failed to retrieve topics.");
                }

                displaySearchResults(data.topics);
            } catch (error) {
                console.error("Search error:", error);
                alert(error.message);
            }
        });
    });

    function displaySearchResults(topics) {
        searchResults.innerHTML = ""; // Clear previous results
        if (topics.length === 0) {
            searchResults.innerHTML = "<li>No topics found.</li>";
            return;
        }

        topics.forEach(topic => {
          const searchResultsContainer = document.createElement("ul");
          searchResultsContainer.id = "search-results";
          document.getElementById("subscribe-topic").appendChild(searchResultsContainer);
            const li = document.createElement("li");
            li.textContent = `${topic.name}`;
            searchResultsContainer.appendChild(li);
            const p = document.createElement("p");
            p.textContent =`${topic.type}`;
            searchResultsContainer.appendChild(p);
        });
    }
  }
  }
  