let isSendingNotification = false; // Global lock variable

function setupNotificationListener() {
  document.addEventListener("click", async function (event) {

    const sendNotificationBtn = event.target.closest("#subed-notification"); 


    if (!sendNotificationBtn) return;

    event.preventDefault();

    if (isSendingNotification) {
        console.log("Please wait! A notification is already being sent.");
        return;
    }

    const title = document.querySelector(".first-input")?.value.trim();
    const message = document.querySelector(".second-input")?.value.trim();
    const topicId = sendNotificationBtn.getAttribute("data-topic-id"); // ✅ now works

    if (!title || !message || !topicId) {
        console.log("Missing title, message, or topicId");
        return;
    }

    isSendingNotification = true;

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
            body: JSON.stringify({ title, message, topicId }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        showNotification(responseData.message, "success");
    } catch (error) {
        console.error("Notification error:", error);
        showNotification("Error sending notification.", "error");
    } finally {
        isSendingNotification = false;
    }
});
}

// Call this once on page load
setupNotificationListener();









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
  console.log(notification)


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
detailsTopic.classList.add("nav-link", "details-notif");
detailsTopic.href = "#";
detailsTopic.setAttribute("data-topic-id", notification._id);
detailsTopic.setAttribute("data-target", `topic-description-${notification._id}notification-topic`);



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
   read.classList.add("fa-solid", "fa-check-double","i-check");
   read.setAttribute("data-topic-id", notification._id);
   const unread = document.createElement("i");
   unread.classList.add("fa-solid", "fa-xmark","i-uncheck");
   unread.setAttribute("data-topic-id", notification._id);


   if(notification.isRead){
read.style.background = "green";
   } else {
    unread.style.background = "red"
   }





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


let isFetchingNotification = false; // Prevents multiple rapid clicks

document.addEventListener("click", function (event) {
    const detailsTopic = event.target.closest(".details-notif");

    if (!detailsTopic) {
        return;
    }

    event.preventDefault();

    if (isFetchingNotification) {
        console.log("Please wait! A notification fetch is already in progress.");
        return; // Prevent multiple clicks
    }

    const divId = detailsTopic.getAttribute("data-topic-id");
    console.log("Clicked topic ID:", divId);

    if (divId) {
        isFetchingNotification = true; // Lock to prevent extra clicks

        fetchNotificationById(divId)
            .finally(() => {
                isFetchingNotification = false; // Unlock after completion
            });
    }
});




let isMarkingAsRead = false; // Prevents multiple rapid clicks

document.addEventListener("click", function (event) {
    const read = event.target.closest(".i-check");

    if (!read) {
        return;
    }

    event.preventDefault();

    if (isMarkingAsRead) {
        console.log("Please wait! A notification is already being marked as read.");
        return; // Prevent multiple clicks
    }

    const divId = read.getAttribute("data-topic-id");
    console.log("Clicked topic ID:", divId);

    if (divId) {
        isMarkingAsRead = true; // Lock to prevent extra clicks

        markAsRead(divId)
            .finally(() => {
                isMarkingAsRead = false; // Unlock after completion
            });
    }
});



let isMarkingAsUnread = false; // Prevents multiple rapid clicks

document.addEventListener("click", function (event) {
    const unread = event.target.closest(".i-uncheck");

    if (!unread) {
        return;
    }

    event.preventDefault();

    if (isMarkingAsUnread) {
        console.log("Please wait! A notification is already being marked as unread.");
        return; // Prevent multiple clicks
    }

    const divId = unread.getAttribute("data-topic-id");
    console.log("Clicked topic ID:", divId);

    if (divId) {
        isMarkingAsUnread = true; // Lock to prevent extra clicks

        markAsUnRead(divId)
            .finally(() => {
                isMarkingAsUnread = false; // Unlock after completion
            });
    }
});





let isDeletingNotification = false; // Prevents multiple rapid clicks

document.addEventListener("click", function (event) {
    // Check if the clicked element or its parent is the trash button
    const trashButton = event.target.closest(".notif-trash-button-Id");

    if (!trashButton) {
        return;
    }

    event.preventDefault();

    if (isDeletingNotification) {
        console.log("Please wait! A notification is already being deleted.");
        return; // Prevent multiple clicks
    }

    const topicId = trashButton.getAttribute("data-topic-id");
    console.log("Unsubscribing from:", topicId);

    if (topicId) {
        isDeletingNotification = true; // Lock to prevent extra clicks

        deleteNotifInbox(topicId)
            .finally(() => {
                isDeletingNotification = false; // Unlock after completion
            });
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
      deletedNotification.parentElement.parentElement.parentElement.remove(); // Removes the entire element from the list
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
       
    
    let isDeletingNotif = false; // Prevents multiple rapid clicks

    document.addEventListener("click", function (event) {
        // Check if the clicked element or its parent is the trash button
        const trashButton = event.target.closest(".notif-trash-button");
    
        if (!trashButton) {
            return;
        }
    
        event.preventDefault();
    
        if (isDeletingNotif) {
            console.log("Please wait! A notification is already being deleted.");
            return; // Prevent multiple clicks
        }
    
        const topicId = trashButton.getAttribute("data-topic-id");
        console.log("Unsubscribing from:", topicId);
    
        if (topicId) {
            isDeletingNotif = true; // Lock to prevent extra clicks
    
            deleteNotif(topicId)
                .finally(() => {
                    isDeletingNotif = false; // Unlock after completion
                });
        }
    });
    
      


    
    }
    
    


