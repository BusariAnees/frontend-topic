async function sendNotification(data) {
  
//   const sendNotificationBtn = document.getElementById("subed-notification")
//   if (!sendNotificationBtn) {
//     return console.log("empty");
//   }

  document.addEventListener("click", async function (event) {
    const sendNotificationBtn = event.target.closest("#subed-notification");
    
     const firstInput = document.querySelector('.first-input');
     const secondInput = document.querySelector('.second-input');

     if (!firstInput || !secondInput) {
      return; // Stop execution if inputs are missing
    }
     
     const title = firstInput.value;
     const message = secondInput.value


    if (sendNotificationBtn) {
      event.preventDefault();
      console.log("Send Notification button clicked!");
  
      try {
        const token = localStorage.getItem("authToken");
  
        if (!token) {
          return console.log("Token not found");
        }
  
  
        const response = await fetch("http://localhost:5001/api/notifications/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ title: title, message: message, topicId: data }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
  
        const responseData = await response.json();
        showNotification(responseData.message, 'success');
      } catch (error) {
        showNotification('Error sending notification.', 'error');
      }
    }
  });

  
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
          updateInbox(responseData)
          // console.log("nofication is available: ", responseData);  

          console.log(" Received Notification successfully!", responseData);
      } catch (error) {
          console.error("Error receiving notification:", error.message);
      }
  }


  function updateInbox(notification) {
   

 
notification.forEach(notification => {


const createdDate = new Date(notification.createdAt).toLocaleString("en-US", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
})

console.log(createdDate)


  const inbox = document.getElementById("inbox"); // ✅ Ensure 'inbox' exists

  const ul = inbox.querySelector(".article-ul");

const div = document.createElement('div');
div.classList.add('article-div');
  // Create notification item
  const article = document.createElement("li");
  article.classList.add("article-li");


   // Create message paragraph
      const paragraph = document.createElement("p");
   paragraph.textContent = notification.title;

   const date = document.createElement('div');
   date.textContent = createdDate;

     // Append elements
     article.appendChild(paragraph);
     article.appendChild(date);
     div.appendChild(article);
     ul.appendChild(div);
});
   

  

    console.log("📩 Inbox updated with new notification!");
}
