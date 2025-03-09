async function markAsRead(data) {
    const read = document.querySelector(".i-check");
    console.log("read", data);
    const unread = document.querySelector(".i-uncheck")
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No token found");
        return;
      }
  
      // Use PATCH instead of DELETE & update the URL to match the backend route
      const response = await fetch(`http://localhost:5001/api/notifications/${data}/mark-as-read`, {
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


   // Find the specific read/unread icons using data-topic-id
   const readIcon = document.querySelector(`.i-check[data-topic-id="${data}"]`);
   const unreadIcon = document.querySelector(`.i-uncheck[data-topic-id="${data}"]`);

   // Change background colors for the correct notification
   if (readIcon) readIcon.style.background = "green";
   if (unreadIcon) unreadIcon.style.background = "#cecfd1";
    
       
     
    } catch (error) {
      showNotification(error.message, "error");
    }
  }


  async function markAsUnRead(notificationId) {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.log("No token found");
            return;
        }

        const response = await fetch(`http://localhost:5001/api/notifications/${notificationId}/mark-as-unread`, {
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


           // Find the specific read/unread icons using data-topic-id
   const readIcon = document.querySelector(`.i-check[data-topic-id="${notificationId}"]`);
   const unreadIcon = document.querySelector(`.i-uncheck[data-topic-id="${notificationId}"]`);

   // Change background colors for the correct notification
   if (readIcon) readIcon.style.background = "#cecfd1";
   if (unreadIcon) unreadIcon.style.background = "red";


    } catch (error) {
        showNotification(error.message, "error");
    }
}

  