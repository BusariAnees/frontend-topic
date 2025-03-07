async function markAsRead() {
    console.log("delete", data);
  
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
  