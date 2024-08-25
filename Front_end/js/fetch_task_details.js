// Function to fetch task details from the server
async function fetchTaskDetails(userId, taskId) {
    try {
        const response = await fetch(`/api/users/${userId}/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const taskDetails = await response.json();
        return taskDetails;
    } catch (error) {
        console.error('Error fetching task details:', error);
        return null;
    }
}

// Populate the form with task details once the page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const userId = 'yourUserId'; // Replace with actual user ID
    const taskId = 'yourTaskId'; // Replace with actual task ID

    // Fetch task details
    const taskDetails = await fetchTaskDetails(userId, taskId);

    if (taskDetails) {
        document.getElementById("name").value = taskDetails.name || '';
        document.getElementById("description").value = taskDetails.description || '';
        document.getElementById("due-date-day").value = taskDetails.day || '';
        document.getElementById("due-date-month").value = taskDetails.month || '';
        document.getElementById("due-date-year").value = taskDetails.year || '';
        // Set other fields as needed
    } else {
        console.error('Task details could not be loaded.');
    }
});
