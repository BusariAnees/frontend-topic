function initUserPage() {
    displayUserData();
    addProfileUpdateListener();
    initTopicForm();
    subscription ();
    privateSubcription ();
    getMyTopics();
   
  

    //public and private results container available globally
    const searchResults = document.createElement("ul");
    searchResults.id = "search-re";
    document.getElementById("subscribe-topic").appendChild(searchResults);

  
    function setupNavigation() {
      const links = document.querySelectorAll(".nav-link");
      const sections = document.querySelectorAll(".content-section");
  
      links.forEach(link => {
          link.addEventListener("click", (e) => {
              e.preventDefault();
              sections.forEach(section => section.classList.remove("active"));
              document.getElementById(link.getAttribute("data-target"))?.classList.add("active");
          });
      });
  }
  
  // Call this function again after appending new elements
  setupNavigation();
  
  

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
        const secretId = type === 'private' ? secretIdInput.value.trim() : null;
     
        console.log(secretId)
        if (!name || !type) {
          responseMessage.innerText = 'Name and Type are required.';
          return;
        }
    
        try {
          const token = localStorage.getItem('authToken');
    
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
  
      
  }
    

  async function privateSubcription () {
    const searchButtons = document.querySelector("#button-private");
    const secretIdInput = document.getElementById("secret-id");
    searchButtons.addEventListener("click", async function () {
            const inputField = secretIdInput;
            const searchValue = inputField.value.trim();
            
            if (!searchValue) {
                alert("Please enter a topic name or secret ID.");
                return;
            }

            try {
              const token = localStorage.getItem('authToken');
           
              if (!token) return console.error("No token found.");


                const response = await fetch("http://localhost:5001/api/topics/private/search", {
                    method: "POST",
                    headers: {
                      'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ secretId: searchValue }),
                });

                const data = await response.json();
                console.log(searchValue)
                
                if (!response.ok) {
                    throw new Error(data.message || "Failed to retrieve topics.");
                }

                else if (!data.topic || typeof data.topic !== "object") {
                  console.error("No valid topic found in response:", data);
                  alert("No topic found.");
                  return;
              }
             
              displaySearchResults(data.topic);
              
            } catch (error) {
                console.error("Search error:", error);
                alert(error.message);
            }
        });
    

  
      
      
  }

 

  function displaySearchResults(topics) {
    if (!searchResults) {
        console.error("Search results container not found.");
        return;
    }

    searchResults.innerHTML = ""; // Clear previous results

    if (!topics || (Array.isArray(topics) && topics.length === 0)) {
        searchResults.innerHTML = "<li>No topics found.</li>";
        return;
    }

    const topicsArray = Array.isArray(topics) ? topics : [topics];

    topicsArray.forEach(topic => {
        const topicContainer = document.createElement("div");
        topicContainer.classList.add("topic-item");

        const li = document.createElement("li");
        li.textContent = `Topic: ${topic.name}`;

        const p = document.createElement("p");
        p.textContent = `Type: ${topic.type}`;

        // Join Button
        const joinButton = document.createElement("button");
        joinButton.textContent = "Join";
        joinButton.classList.add("join-topic-btn");
        joinButton.setAttribute("data-topic-id", topic._id);

        // Topic Details Button
        const describeButton = document.createElement("a");
        describeButton.href = "#";
        describeButton.textContent = "Topic Details";
        describeButton.classList.add("nav-link", "detail-nav");
        describeButton.setAttribute("data-topic-id", topic._id);
        describeButton.setAttribute("data-target", `topic-description-${topic._id}`);

        // Create details section dynamically
        const detailsSection = document.createElement("article");
        detailsSection.id = `topic-description-${topic._id}`;
        detailsSection.classList.add("content-section");
    

   

    getTopicDetails(topic._id, topic);

        // Append elements
        topicContainer.appendChild(li);
        topicContainer.appendChild(p);
        topicContainer.appendChild(joinButton);
        topicContainer.appendChild(describeButton);
        searchResults.appendChild(topicContainer);

        // Append the details section to the main content area
        document.querySelector(".welcome-ul").appendChild(detailsSection);
    });

    // Re-run navigation setup to recognize new sections
    setupNavigation();
}


// Event delegation to handle "Join" button clicks
document.getElementById("subscribe-topic").addEventListener("click", async (event) => {
  if (event.target.classList.contains("join-topic-btn")) {
      const topicId = event.target.getAttribute("data-topic-id");
      if (topicId) {
          await joinTopic(topicId);
      }
  }
});





async function joinTopic(topicId) {
  const successMessage = document.createElement("p");

  searchResults.appendChild(successMessage);
  try {
      const token = localStorage.getItem("authToken");

      if (!token) {
          console.error("No token found.");
          return alert("You need to log in to join a topic.");
      }

      const response = await fetch("http://localhost:5001/api/topics/join", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ topicId })
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || "Failed to join topic.");
      }
      console.log(localStorage.setItem("id", data.topic._id));
      console.log("Joined Topic:", data.topic);
      successMessage.textContent = data.message;
      successMessage.style.color = "green";
  } catch (error) {
      console.error("Join error:", error.message);
      successMessage.textContent = error.message;
      successMessage.style.color = "red";
  }
}


document.getElementById("logout-div").addEventListener("click", function(){
  localStorage.clear(),
  loadPage("components/auth/login.html");
})


}
  