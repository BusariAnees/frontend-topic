async function getUserData() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return console.error("No token found.");

      const response = await fetch('http://localhost:5001/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      

      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);

    }
  }

  async function displayUserData() {
    const userData = await getUserData();

    if (userData) {
      document.getElementById("my-name").textContent = userData.fullName;
      document.getElementById("name").textContent = userData.fullName.toUpperCase();
      document.getElementById("name-editing").value = userData.fullName;
      document.getElementById("email-editing").value = userData.email;
      document.getElementById("topic").value = userData.subscribedTopics;
    } else {
      console.error("User data is null or undefined.");
    }
  }



  