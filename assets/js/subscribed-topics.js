
async function getTopicDetails(topicId) {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // Fix condition and stop execution early
      console.error("No token found");
      return;
    }

    // console.log("Fetching topic details for ID:", id); // Debugging

    const response = await fetch(
      `http://localhost:5001/api/topics/${topicId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    try {
      getDetails(topicId, data);
    } catch (error) {
      console.error("Error in getDetails:", error.message);
    }
  } catch (error) {
    console.error("Find error:", error.message);
  }
}

function getDetails(topicId, topicDetails) {
    const createdAtDate = new Date(topicDetails.topic.createdAt);
    const updatedAtDate = new Date(topicDetails.topic.updatedAt);
    
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
  const details = document.getElementById(`topic-description-${topicId}`);
  details.innerHTML = ` 
  <span class="topic-span">
  <i class="fa-solid fa-arrow-left"></i>
  <a class="nav-link topic-link" data-target="subscribe-topic" href="#"
    >back</a>
</span>
  <form id="topicForm">
     <label for="name">Topic Name:</label>
     <input type="text" id="name" value=${topicDetails.topic.name} readonly><br><br>

     <textarea id="description" name="Description" cols="30" rows="10" readonly>
     ${topicDetails.topic.description}
   </textarea>
 
 
     <label for="creator">Created by (Email):</label>
     <input type="text" id="creator" value=${topicDetails.topic.creator.email} readonly><br><br>
 
 
     <label for="subscribers">Subscribers:</label>
     <input type="text" id="subscribers" value=${topicDetails.topic.__v} readonly><br><br>
 
     <label for="type">Type:</label>
     <input type="text" id="type"  value=${topicDetails.topic.type} readonly><br><br>
 
     <label for="createdAt">Created At:</label>
     <input type="text" id="createdAt" value=${formattedCreatedAt} readonly><br><br>
 
     <label for="updatedAt">Last Updated:</label>
     <input type="text" id="updatedAt" value=${formattedUpdatedAt} readonly><br><br>
 </form>`;

     // Re-run navigation setup to recognize new sections
     setupNavigation();
}



async function getMyTopics() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
     return console.log("token not found");
    }

    const response = await fetch("http://localhost:5001/api/topics/my/topics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    // myListedTopics(data);
    

  await   fetchTopics(data);




 
  //  await  Unsubscribe(data);
  } catch (error) {
    console.error("Find error:", error.message);
  }
}

//  function myListedTopics(data){

//     const grabList = data.map(topic => paragraph.textContent(`${topic}`) )
//  }

async function fetchTopics(response) {



  if (typeof setupNavigation === "function") {
    setupNavigation();  // Safe to call
  } else {
    console.error("setupNavigation is not defined!");
  }
  


  try {
    if (response && response.topics && response.topics.length > 0) {
      
      const articleManage = document.querySelector('#manage-topic');
      const articleUl = document.querySelector(".manage-article"); // Get the existing article

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
        Detaildiv.setAttribute("data-target", `topic-description-${topic._id}manage-topic`);


        paragraph.textContent = topic.name; // Set the topic name
        div.textContent = formattedDate;
        Detaildiv.textContent = "View Details"
   
        

        // Create details section dynamically
        const newSection = document.createElement("article");
        newSection.id = `topic-description-${topic._id}manage-topic`;
        newSection.classList.add("content-section");
        newSection.innerHTML = ` 
        <span class="topic-span">
  <i class="fa-solid fa-arrow-left"></i>
  <a class="nav-link topic-link" data-target="manage-topic" href="#"
    >back</a>
</span>
        <p class="topic-header">Managed Topic</p>
        <form id="topicForm">
        <label for="name">Topic Name:</label>
        <input type="text" id="name" value=${topic.name} readonly><br><br>
    
        <textarea id="description" name="Description" cols="30" rows="10" readonly>
        ${topic.description}
      </textarea>
    
    
    
        <label for="subscribers">Subscribers:</label>
         <div id="subscribed-users">
          <input class="subscribed-input" type="text" id="subscribers" value=${topic.__v} readonly><br><br>
          <button id="subscribed-button" data-topic-id=${topic._id}>Subscribed Users</button>
        </div>
        <div class="subed-class" id="subed-users-${topic._id}"></div>
    
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
        articleDiv.appendChild(Detaildiv);
        articleUl.appendChild(articleDiv); // Append <p> inside article
        articleManage.appendChild(articleUl);

 
        // Append the details section to the main content area
        document.querySelector(".welcome-ul").appendChild( newSection);


        Detaildiv.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default link behavior
          const topicId = event.target.getAttribute("data-topic-id");
          console.log("Clicked topic ID:", topicId);
      
          sendNotification(topicId);
        });

      });
    } else {
      console.error("No topics found!");
      
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
  }


 


  document.addEventListener("click", function(event) {
    const subButton = event.target.closest("#subscribed-button");

    if (subButton) {
        event.preventDefault(); // Prevent default only for this button

        let subId = subButton.getAttribute("data-topic-id");
        console.log("Raw subscribed users ID:", subId);

        if (subId) {
            // Remove "manage-topic" if it exists in the ID
            subId = subId.replace("manage-topic", "");
            getTopicSubscribers(subId);
        }

        // Clear all elements with class "subed-class"
        document.querySelectorAll(".subed-class").forEach(el => {
            el.innerHTML = "";
        });


    } else {
      return;
    }
});




    // Re-run navigation setup to recognize new sections
    setupNavigation();

  
}

async function getTopicSubscribers(members) {
  try {
      const token = localStorage.getItem("authToken");
      if (!token) {
          console.log("No token found");
          return;
      }

   
      const response = await fetch(`http://localhost:5001/api/topics/${members}/subscribers`, {
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
       displaySubscribers(data.subscribers, members);
    
      console.log("Subscribers:", data);
  } catch (error) {
      console.error("Error:", error.message);
  }
  

}


 function displaySubscribers(subscribers,topicId) {
  const subscriberContainer = document.querySelector(`#subed-users-${topicId}`);

console.log(subscriberContainer)

  

  if (!Array.isArray(subscribers) || subscribers.length === 0) {
      subscriberContainer.innerHTML += "<p>No subscribers yet.</p>";
      return;
  }

const ul = document.createElement("ul"); // Created an unordered list
ul.id = "subed-list-ul";

const firstInput = document.createElement('input'); // Created input
firstInput.type = 'text';  // Set type correctly
firstInput.classList.add('first-input'); // Added class
firstInput.placeholder = "Your Title Here";

const secondInput = document.createElement('input'); // Created input
secondInput.type = 'text';  // Set type correctly
secondInput.placeholder = "Enter Your Message Here"
secondInput.classList.add('second-input'); // Added class

ul.appendChild(firstInput); // Append inputs to UL
ul.appendChild(secondInput);



 subscribers.forEach(sub => {
      const li = document.createElement('li');
   
      li.textContent = sub.email; // Use correct property
      ul.appendChild(li);
      
  });
  


  const subButton= document.createElement('button');
  subButton.textContent = "Send Notification";
  subButton.id = "subed-notification";

  

  ul.appendChild(subButton);
  subscriberContainer.appendChild(ul);

  subscriberContainer.style.display = "block"; 

}



