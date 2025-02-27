
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
  details.innerHTML = ` <form id="topicForm">
     <label for="name">Topic Name:</label>
     <input type="text" id="name" value=${topicDetails.topic.name} readonly><br><br>
 
     <label for="description">Description:</label>
     <input type="text" id="descriptio" value=${topicDetails.topic.description}  readonly><br><br>
 
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
        Detaildiv.setAttribute("data-target", `topic-description-${topic._id}`);


        paragraph.textContent = topic.name; // Set the topic name
        div.textContent = formattedDate;
        Detaildiv.textContent = "View Details"
   
        

        // Create details section dynamically
        const newSection = document.createElement("article");
        newSection.id = `topic-description-${topic._id}`;
        newSection.classList.add("content-section");
        newSection.innerHTML = ` <form id="topicForm">
        <label for="name">Topic Name:</label>
        <input type="text" id="name" value=${topic.name} readonly><br><br>
    
        <label for="description">Description:</label>
        <input type="text" id="description" value=${topic.description}  readonly><br><br>
    
    
    
        <label for="subscribers">Subscribers:</label>
        <input type="text" id="subscribers" value=${topic.__v} readonly><br><br>
    
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

      });
    } else {
      console.error("No topics found!");
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
  }
    // Re-run navigation setup to recognize new sections
    setupNavigation();
}



