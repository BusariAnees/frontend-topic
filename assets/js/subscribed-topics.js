async function getTopicDetails(topicId, topicDetails) {
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
      console.log("token not found");
    }

    const response = await fetch("http://localhost:5001/api/topics/my/topics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    // myListedTopics(data);

    fetchTopics(data);

    console.log("my data:", data.topics[1].createdAt);
    console.log("keys in data:", Object.keys(data));
  } catch (error) {}
}

//  function myListedTopics(data){

//     const grabList = data.map(topic => paragraph.textContent(`${topic}`) )
//  }

async function fetchTopics(response) {
  try {
    if (response && response.topics && response.topics.length > 0) {
      const articleUl = document.querySelector(".article-ul"); // Get the existing article

      if (!articleUl) {
        console.error("Error: .article-Ul not found!");
        return;
      }

      response.topics.forEach((topic) => {
        const date = new Date(topic.createdAt); // Convert string to Date object
        const formattedDate = date.toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        const article = document.createElement("li");
        article.classList.add("article-li");
        const paragraph = document.createElement("p"); // Create a new <p>
        const div = document.createElement("div");

        paragraph.textContent = topic.name; // Set the topic name
        div.textContent = formattedDate;
   

        article.appendChild(paragraph);
        article.appendChild(div);
        articleUl.appendChild(article); // Append <p> inside article

        console.log("Added:", topic.name);
      });
    } else {
      console.error("No topics found!");
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
  }
}
