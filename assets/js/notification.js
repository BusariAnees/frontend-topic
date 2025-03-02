async function sendNotification(data) {
  console.log(data)  
  const sendNotificationBtn = document.querySelector("#subed-notification")

sendNotificationBtn.addEventListener('click', async function (event) {
    event.preventDefault();



    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.log("Token not found");
            return;
        }

        const response = await fetch("http://localhost:5001/api/notifications/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ title: data.topic.name, message: data.message, topicId: data.topic._id }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("Notification sent successfully!", responseData);
    } catch (error) {
        console.error("Error sending notification:", error.message);
    }
})

  
}






async function fetchNotifications() {
   
    
      try {
          const token = localStorage.getItem("authToken");
  
          if (!token) {
              console.log("Token not found");
              return;
          }
  
          const response = await fetch("http://localhost:5001/api/notifications/", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
          });
  
          if (!response.ok) {
              throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
  
          const responseData = await response.json();
          console.log("nofication is available: ", responseData);  

          console.log(" Received Notification successfully!", responseData);
      } catch (error) {
          console.error("Error receiving notification:", error.message);
      }
  }



// function updateInbox(notification) {
//     // const inbox = document.getElementById("inbox");
//     const ul = inbox.querySelector(".article-ul");
//     const article = document.createElement("li");
//     article.classList.add("article-li");
//     const paragraph = document.createElement("p");
//     const div = document.createElement("div");
 

// console.log(notification);

// const inbox = document.querySelector("inbox-li");
// inbox.textContent = notification.message;

//     // Create message paragraph
//      article.textContent = notification.message;

//     // // Create date div
//     // const dateDiv = document.createElement("div");
//     // dateDiv.classList.add("article-date");
//     // dateDiv.textContent = new Date().toLocaleDateString(); // Current date

//     // Append elements
//    article.appendChild(paragraph);
//    ul.appendChild(article);

//     console.log("📩 Inbox updated with new notification!");
// }