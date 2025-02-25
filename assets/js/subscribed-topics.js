



async function getTopicDetails(topicId, topicDetails) {
    try {
        const token = localStorage.getItem("authToken");
        console.log(topicId);
        console.log(topicDetails);

        if (!token) { // Fix condition and stop execution early
            console.error("No token found");
            return;
        }

        // console.log("Fetching topic details for ID:", id); // Debugging

        const response = await fetch(`http://localhost:5001/api/topics/${topicId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Topic details:", data); // Log the fetched topic data
        try {
            getDetails(topicId, data);
        } catch (error) {
            console.error("Error in getDetails:", error.message);
        }

    } catch (error) {
        console.error("Find error:", error.message);
    }


}




function getDetails (topicId, topicDetails){

    const details = document.getElementById(`topic-description-${topicId}`)
     details.innerHTML = 
 ` <form id="topicForm">
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
     <input type="text" id="createdAt" value=${topicDetails.topic.createdAt} readonly><br><br>
 
     <label for="updatedAt">Last Updated:</label>
     <input type="text" id="updatedAt" value=${topicDetails.topic.updatedAt} readonly><br><br>
 </form>`;
 }
 

 