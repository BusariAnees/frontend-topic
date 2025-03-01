async function getSubscribedTopics(){
    try{
        const token = localStorage.getItem("authToken");

        if(!token) {
            console.log('token not found');
            return;
        }

        const response = await fetch(`http://localhost:5001/api/topics/subscribed`,{
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
         },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
      
          const data = await response.json();
         fetchSubcribedTopics(data)

          }
          catch (error) {
            console.error("Find error:", error.message);
          }

}



async function fetchSubcribedTopics(response) {



    if (typeof setupNavigation === "function") {
      setupNavigation();  // Safe to call
    } else {
      console.error("setupNavigation is not defined!");
    }
    
  
  
    try {
      if (response && response.topics && response.topics.length > 0) {
        
        const articleManage = document.querySelector('#message-sub');
        const articleUl = document.querySelector(".sub-article"); // Get the existing article
  
        if (!articleUl) {
          console.error("Error: .article-Ul not found!");
          return;
        }
  
        response.topics.forEach((topic) => {
          const createdAtDate = new Date(topic.createdAt);
          const updatedAtDate = new Date(topic.updatedAt);
          
          const formattedCreatedAt = createdAtDate.toLocaleString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric"
          });
          
          const formattedUpdatedAt = updatedAtDate.toLocaleString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric"
          });
  
  
  
          const date = new Date(topic.createdAt); // Convert string to Date object
          const formattedDate = date.toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
  
          const articleDiv = document.createElement("div");
          articleDiv.classList.add("article-div");
          const article = document.createElement("li");
          article.classList.add("article-li");
          const paragraph = document.createElement("p"); // Create a new <p>
          const div = document.createElement("div");
          const Detaildiv = document.createElement("a") 
          Detaildiv.href = "#";
          Detaildiv.classList.add("nav-link");
          Detaildiv.setAttribute("data-topic-id", topic._id);
          Detaildiv.setAttribute("data-target", `topic-description-${topic._id}sub-topic`);
          const divI = document.createElement("div");
          divI.classList.add("divI");
          const trashButton = document.createElement("a");
          trashButton.classList.add("trash-button")
         const icon = document.createElement("i");
         icon.classList.add("fa-solid", "fa-trash");
         trashButton.setAttribute("data-topic-id", topic._id);
      



  
          paragraph.textContent = topic.name; // Set the topic name
          div.textContent = formattedDate;
          Detaildiv.textContent = "View Details"
     
          
  
          // Create details section dynamically
          const newSection = document.createElement("article");
          newSection.id = `topic-description-${topic._id}sub-topic`;
          newSection.classList.add("content-section");
          newSection.innerHTML = `
          <p class= "topic-header">Subscribed Topic</p>
          <form id="topicForm">
          <label for="name">Topic Name:</label>
          <input type="text" id="name" value=${topic.name} readonly><br><br>
      
          <label for="description">Description:</label>
          <textarea id="description" name="Description" cols="30" rows="10" readonly>
          ${topic.description}
        </textarea>

          <label for="subscribers">Subscribers:</label>
          <input  type="text" id="subscribers" value=${topic.__v} readonly><br><br>
         
          <label for="type">Type:</label>
          <input type="text" id="type"  value=${topic.type} readonly><br><br>
      
          <label for="createdAt">Created At:</label>
          <input type="text" id="createdAt" value=${formattedCreatedAt} readonly><br><br>
      
          <label for="updatedAt">Last Updated:</label>
          <input type="text" id="updatedAt" value=${formattedUpdatedAt} readonly><br><br>
      </form>`;
          
          article.appendChild(paragraph);
          article.appendChild(div);
          articleDiv.appendChild(article);
         divI.appendChild(Detaildiv);
          trashButton.appendChild(icon);
          divI.appendChild(trashButton);
          articleDiv.appendChild(divI);
          articleUl.appendChild(articleDiv); // Append <p> inside article
          articleManage.appendChild(articleUl);
        

        

          // Append the details section to the main content area
          document.querySelector(".welcome-ul").appendChild( newSection);
  

        });
      } else {
        console.error("No topics found!");
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }



// getTopicSubscribers(response.topics[0]._id)


    document.addEventListener("click", function (event) {
        event.preventDefault();
    
        // Check if the clicked element or its parent is the trash button
        const trashButton = event.target.closest(".trash-button");
        if (trashButton) {
            const topicId = trashButton.getAttribute("data-topic-id");
            console.log("Unsubscribing from:", topicId);
            if (topicId) {
                Unsubscribe(topicId);
            }
        }
    });
    
      // Re-run navigation setup to recognize new sections
      setupNavigation();
  }




async function Unsubscribe(data) {
    const articleManage = document.querySelector('#message-sub');
    const responseMessage = document.createElement("p");
    responseMessage.id = "subcribed-message";
    articleManage.appendChild(responseMessage); 



    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No token found");
        return;
      }
  
      console.log(data);
      
  
      const response = await fetch("http://localhost:5001/api/topics/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ topicId: data }) // Ensure correct payload
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status} - ${response.statusText}`);
      }
  
      const responseData = await response.json(); 
      responseMessage.textContent = responseData.message || "Unsubscribed successfully";
      responseMessage.style.color = "green";
    } catch (error) {
      console.error("Find error:", error.message);
      responseMessage.textContent = responseData.message;
      responseMessage.style.color = "red";
    }
  }



 



