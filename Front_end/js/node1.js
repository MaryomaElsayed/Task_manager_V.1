let user_name = function () {
    // Retrieve the first name from local storage
    const firstName = localStorage.getItem('first_name');
    
    // Get the element where you want to display the first name
    const displayElement = document.getElementById('display_name');
    
    if (firstName && displayElement) {
        // Set the innerHTML of the element to display the first name
        displayElement.innerHTML = `${firstName} tasks`;
    }
};

// Call the function to display the name when the page loads
document.addEventListener("DOMContentLoaded", user_name);




