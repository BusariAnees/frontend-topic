function addProfileUpdateListener() {
    setTimeout(() => {
      const container = document.getElementById("container-form");
      if (!container) {
        console.error("Form container not found.");
        return;
      }

      container.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fullName = document.getElementById("name-editing").value;
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error("No token found.");
          return;
        }

        try {
          const response = await fetch('http://localhost:5001/api/users/me', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName }),
          });

          const data = await response.json();
        

          if (response.ok) {
            loadPage("components/user/user.html");
          } else {
          
               showNotification(data.message, 'error');
          }
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      });
    }, 500);
  }