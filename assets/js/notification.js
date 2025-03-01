async function sendNotification(title, message, topicId) {
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

        const data = await response.json();
        console.log("Notification sent successfully!", data);
    } catch (error) {
        console.error("Error sending notification:", error.message);
    }
}
