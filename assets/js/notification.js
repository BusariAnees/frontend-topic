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




  const inbox = document.getElementById("inbox"); // ✅ Ensure 'inbox' exists

  const ul = inbox.querySelector(".article-ul");

  const readCheck = document.createElement("div");
  readCheck.id = 'inbox-div'

const div = document.createElement('a');
div.classList.add('article-div', "article-div-notif");
// div.setAttribute("data-topic-id", notification._id);
// div.setAttribute("data-target", `topic-description-${notification._id}notification-topic`);
const detailsTopic = document.createElement("a");
detailsTopic.classList.add("nav-link");
detailsTopic.href = "#";
detailsTopic.setAttribute("data-topic-id", topic._id);
detailsTopic.setAttribute("data-target", `topic-description-${topic._id}sub-topic`);


  // Create notification item
  const article = document.createElement("li");
  article.classList.add("article-li");


   // Create message paragraph
      const paragraph = document.createElement("p");
   paragraph.textContent = notification.title;
   detailsTopic.textContent = "View Details"

   const date = document.createElement('div');
   date.textContent = createdDate;

   //messages

   const messages = document.createElement('p');
   messages.id = "notif-messages"
   messages.textContent = notification.message;


//trash

const divI = document.createElement("div");
divI.classList.add("divI");
const trashButton = document.createElement("a");
trashButton.classList.add("notif-trash-button-Id")
const icon = document.createElement("i");
icon.classList.add("fa-solid", "fa-trash");
trashButton.setAttribute("data-topic-id", notification._id);


   //mark as read and unread

   const readDiv = document.createElement("div");
   readDiv.id = "read-div";
   const read = document.createElement("i")
   read.classList.add("fa-solid", "fa-check-double");
   const unread = document.createElement("i");
   unread.classList.add("fa-solid", "fa-xmark");





     // Append elements
     article.appendChild(paragraph);
     article.appendChild(date);
     readDiv.appendChild(read);
     readDiv.appendChild(unread);
     div.appendChild(article);
     divI.appendChild(messages);

     trashButton.appendChild(icon);
     divI.appendChild(trashButton);
     div.appendChild(divI);
     div.appendChild(detailsTopic);
     readCheck.appendChild(div);
     readCheck.appendChild(readDiv);
     ul.appendChild(readCheck);




     


});


document.addEventListener("click", function (event) {


  const divButton = event.target.closest(".article-div-notif");

  if (divButton) {
    event.preventDefault();

  const divId = divButton.getAttribute("data-topic-id");
  console.log("Clicked topic ID:", divId);
if(divId) {
  fetchNotificationById(divId);
}
  }
});




document.addEventListener("click", function (event) {
       
    
  // Check if the clicked element or its parent is the trash button
  const trashButton = event.target.closest(".notif-trash-button-Id");
  if (trashButton) {
    event.preventDefault();

      const topicId = trashButton.getAttribute("data-topic-id");
      console.log("Unsubscribing from:", topicId);
      if (topicId) {
          deleteNotifInbox(topicId);
      }
  }
});
   
    
}



async function deleteNotifInbox(data) {
  console.log("delete", data);

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found");
      return;
    }

    // Use PATCH instead of DELETE & update the URL to match the backend route
    const response = await fetch(`http://localhost:5001/api/notifications/${data}/delete-from-inbox`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    showNotification(responseData.message, "success");

    // ✅ Remove the deleted notification from the UI
    const deletedNotification = document.querySelector(`[data-topic-id="${data}"]`);
    console.log(deletedNotification);
    if (deletedNotification) {
      deletedNotification.parentElement.remove(); // Removes the entire element from the list
    }
  } catch (error) {
    showNotification(error.message, "error");
  }
}





async function fetchNotificationById(userId) {
  console.log("notification",userId)
    
  try {
      const token = localStorage.getItem("authToken");

      if (!token) {
          console.log("Token not found");
          return;
      }

      const response = await fetch(`http://localhost:5001/api/notifications/${userId}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const topic = await response.json();


      console.log(topic._id)

      // Create details section dynamically
      const newSection = document.createElement("article");
      newSection.id = `topic-description-${topic._id}notification-topic`;
      newSection.classList.add("content-section");
      newSection.innerHTML = ` 
      <span class="topic-span">
<i class="fa-solid fa-arrow-left"></i>
<a class="nav-link topic-link" data-target="inbox" href="#"
  >back</a>
</span>
      <p class="topic-header">Notification Detail</p>
      <form id="topicForm">
      <label for="title">Title:</label>
      <input type="text" id="title" value=${topic.title} readonly><br><br>
  
      <textarea id="description" name="Description" cols="30" rows="10" readonly>
      ${topic.message}
    </textarea>
  
  </form>`;

   

     
document.querySelector(".welcome-ul").appendChild(newSection);

 setupNavigation();
      
      // console.log("nofication is available: ", responseData);  

      console.log(" Notification successfully!", topic);
  } catch (error) {
      console.error("Error receiving notification:", error.message);
  }
}


async function deleteNotif(data) {
  console.log("delete", data);

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found");
      return;
    }


    const response = await fetch(`http://localhost:5001/api/notifications/${data}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    showNotification(responseData.message, 'success');

    // ✅ Remove the deleted notification from the UI
    const deletedNotification = document.querySelector(`[data-topic-id="${data}"]`);
    console.log(deletedNotification);
    if (deletedNotification) {
      deletedNotification.parentElement.parentElement.remove(); // Removes the entire element from the list
    }

  } catch (error) {
    showNotification(error.message, 'error');
  }
}









async function fetchSentNotifications() {
  
    
  try {
      const token = localStorage.getItem("authToken");

      if (!token) {
          console.log("Token not found");
          return;
      }

      const response = await fetch(`http://localhost:5001/api/notifications/sent`, {
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
      updateSentNotification(responseData)
      
      // console.log("nofication is available: ", responseData);  

  
  } catch (error) {
      console.error("Error receiving notification:", error.message);
  }
}


//the sent notifications
function updateSentNotification(notification) {

  notification.forEach(notification => {


    const createdDate = new Date(notification.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
    
  
    
    
      const inbox = document.getElementById("sent-topic"); // ✅ Ensure 'inbox' exists
    
      const ul = inbox.querySelector(".article-ul");
    
    const div = document.createElement('div');
    div.classList.add('article-div');
      // Create notification item
      const article = document.createElement("li");
      article.classList.add("article-li");


         //messages

   const messages = document.createElement('p');
   messages.id = "notif-messages"
   messages.textContent = notification.message;

   const divI = document.createElement("div");
divI.classList.add("divI");
   const trashButton = document.createElement("a");
trashButton.classList.add("notif-trash-button")
const icon = document.createElement("i");
icon.classList.add("fa-solid", "fa-trash");
trashButton.setAttribute("data-topic-id", notification._id);
    
    
       // Create message paragraph
          const paragraph = document.createElement("p");
       paragraph.textContent = notification.title;
    
       const date = document.createElement('div');
       date.textContent = createdDate;
    
         // Append elements
         article.appendChild(paragraph);
         article.appendChild(date);
         div.appendChild(article);
         divI.appendChild(messages);
         trashButton.appendChild(icon);
         divI.appendChild(trashButton);
         div.appendChild(divI);
         ul.appendChild(div);
    });
       
    
document.addEventListener("click", function (event) {
       
    
  // Check if the clicked element or its parent is the trash button
  const trashButton = event.target.closest(".notif-trash-button");
  if (trashButton) {
    event.preventDefault();

      const topicId = trashButton.getAttribute("data-topic-id");
      console.log("Unsubscribing from:", topicId);
      if (topicId) {
          deleteNotif(topicId);
      }
  }
});
      


    
    }
    
    


