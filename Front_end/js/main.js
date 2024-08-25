// FINALLLLLLL CODEEEEEEEEEEEE
//WORKIIIIIIIIINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNGGGGGGGGGGGGGGGGGGGGG
// Elements
// Define constants for DOM elements
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
const listView = document.getElementById("list-view");
const boardView = document.getElementById("board-view");
const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const statusSelect = document.getElementById("status-select");
const statusDropdown = document.getElementById("status-dropdown");
const statusRadios = document.querySelectorAll("input[name='status-option']");
const addTaskForm = document.querySelector("#set-task-overlay .form");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const deleteTaskCTA = document.getElementById("delete-task-cta");
const notification = document.getElementById("notification");
const signOutButton = document.getElementById('sign-out-button');

const editStatusSelect = document.getElementById('edit-status-select');
const editStatusDropdown = document.getElementById('edit-status-dropdown');
const editStatusInput = document.getElementById('edit-status-input');
const editStatusDisplay = document.getElementById('edit-status-display');
const editStatusRadios = document.querySelectorAll('#edit-status-dropdown input[type="radio"]');

const todoList = document.querySelector(".tasks-list.pink");
const doingList = document.querySelector(".tasks-list.blue");
const doneList = document.querySelector(".tasks-list.green");

// Class definition for Task
class Task {
    constructor(name, description, day, month, year, status) {
        this.name = name;
        this.description = description;
        this.day = day;
        this.month = month;
        this.year = year;
        this.status = status || "To do"; // Default to "To do" if no status is provided
    }

    to_do() {
        this.status = "To do";
    }

    doing() {
        this.status = "Doing";
    }

    done() {
        this.status = "Done";
    }

    toObject() {
        return {
            name: this.name,
            description: this.description,
            day: this.day,
            month: this.month,
            year: this.year,
            status: this.status,
            added_date: new Date(),
            updated_date: new Date()
        };
    }
}

// The current active overlay
let activeOverlay = null;

// Fetch and render tasks
async function fetchTasksAndRender() {
    const userId = localStorage.getItem("user_id");

    try {
        const response = await fetch(`/api/users/${userId}/tasks`);
        if (response.ok) {
            const tasks = await response.json();
            // Clear current tasks
            todoList.innerHTML = '';
            doingList.innerHTML = '';
            doneList.innerHTML = '';
            // Render tasks
            tasks.forEach(task => {
                displayTask(task);
            });
        } else {
            console.error('Failed to fetch tasks:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// EVENT LISTENERS


if (signOutButton) {
    signOutButton.addEventListener('click', (event) => {
        // IMPORTANT FUNC SO THE PAGE DOES NOT RELOAD AUTOMATICALY
        event.preventDefault(); 

        //clear any user-specific data stored in localStorage or sessionStorage
        localStorage.removeItem('user_id');

        // Redirect to the login page
        window.location.href = '/login.html'; // Update with the correct path to your login page
    });
}


// Toggle the visibility of the status dropdown when the status select is clicked
editStatusSelect.addEventListener('click', function () {
    editStatusDropdown.classList.toggle('hide');
});

// Update the status display and hidden input when a radio button is selected
editStatusRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
        if (radio.checked) {
            const selectedStatus = radio.value;
            if (editStatusInput && editStatusDisplay) {
                editStatusInput.value = selectedStatus;
                editStatusDisplay.textContent = selectedStatus;
                editStatusDropdown.classList.add('hide');
            } else {
                console.error('Edit status input or display elements are missing');
            }
        }
    });
});

// Close the dropdown when clicking outside of it
document.addEventListener('click', function (event) {
    if (!editStatusSelect.contains(event.target) && !editStatusDropdown.contains(event.target)) {
        editStatusDropdown.classList.add('hide');
    }
});

// View options radio buttons
radioViewOptions.forEach((radioButton) => {
  radioButton.addEventListener("change", (event) => {
    const viewOption = event.target.value;
    if (viewOption === "list") {
      boardView.classList.add("hide");
      listView.classList.remove("hide");
    } else if (viewOption === "board") {
      listView.classList.add("hide");
      boardView.classList.remove("hide");
    }
  });
});

// Add task button
addTaskCTA.addEventListener("click", () => {
  setTaskOverlay.classList.remove("hide");
  activeOverlay = setTaskOverlay;
  document.body.classList.add("overflow-hidden");
});

// Close buttons
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (activeOverlay) {
      event.preventDefault(); // Prevent default action if needed IMPORTAAAAAAAAAAAANT
      activeOverlay.classList.add("hide");
      activeOverlay = null;
      document.body.classList.remove("overflow-hidden");
    }
  });
});

// Status dropdown
statusSelect.addEventListener("click", () => {
  statusDropdown.classList.toggle("hide");
});

// Status selection
statusRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const selectedStatus = event.target.value;
    if (statusSelect && statusSelect.querySelector("span")) {
        statusSelect.querySelector("span").textContent = selectedStatus;
        statusDropdown.classList.add("hide");
    } else {
        console.error('Status select element or its span is missing');
    }
  });
});

// Add Task Form
addTaskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const day = document.getElementById("due-date-day").value;
    const month = document.getElementById("due-date-month").value;
    const year = document.getElementById("due-date-year").value;
    const status = statusSelect.querySelector("span").textContent;

    const userId = localStorage.getItem("user_id");

    const newTask = {
        name,
        description,
        day,
        month,
        year,
        status,
        added_date: new Date(),
        updated_date: new Date(),
    };

    try {
        const response = await fetch(`/api/users/${userId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        });

        if (response.ok) {
            // Task added successfully, now re-fetch tasks
            await fetchTasksAndRender();
        } else {
            console.error('Failed to add task:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error:', error);
    }

    addTaskForm.reset();
    statusSelect.querySelector("span").textContent = "To do";
    setTaskOverlay.classList.add("hide");
    document.body.classList.remove("overflow-hidden");

    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
});


// Function to send PUT request to update task details
async function updateTask(taskId) {
    const userId = localStorage.getItem("user_id");

    // Gather all field values
    const editTaskName = document.getElementById('edit-task-name').value;
    const editTaskDescription = document.getElementById('edit-task-description').value;
    const editDueDateDay = document.getElementById('edit-due-date-day').value;
    const editDueDateMonth = document.getElementById('edit-due-date-month').value;
    const editDueDateYear = document.getElementById('edit-due-date-year').value;
    
    // Capture status using the hidden input field (updated to match previous working code)
    const editStatusInput = document.getElementById('edit-status-input').value;

    // Prepare the data object
    const taskData = {
        name: editTaskName,
        description: editTaskDescription,
        day: editDueDateDay,
        month: editDueDateMonth,
        year: editDueDateYear,
        status: editStatusInput // Use the hidden input value
    };

    try {
        const response = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
        	await fetchTasksAndRender();

            console.log("Task updated successfully.");
            closeEditOverlay();
        } else {
            console.error("Failed to update task:", response.statusText);
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
}


// Function to close the edit overlay
function closeEditOverlay() {
    const viewTaskOverlay = document.getElementById('view-task-overlay');
    if (viewTaskOverlay) {
        viewTaskOverlay.classList.add('hide');
        document.body.classList.remove('overflow-hidden');
    } else {
        console.error('View task overlay element is missing');
    }
}



// Function to open the task overlay and populate it with task data
function openTaskOverlay(taskId) {
    const userId = localStorage.getItem("user_id");

    fetch(`/api/users/${userId}/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            const editTaskName = document.getElementById('edit-task-name');
            const editTaskDescription = document.getElementById('edit-task-description');
            const editDueDateDay = document.getElementById('edit-due-date-day');
            const editDueDateMonth = document.getElementById('edit-due-date-month');
            const editDueDateYear = document.getElementById('edit-due-date-year');

            if (editTaskName && editTaskDescription && editDueDateDay && editDueDateMonth && editDueDateYear) {
                editTaskName.value = task.name || '';
                editTaskDescription.value = task.description || '';
                editDueDateDay.value = task.day || '';
                editDueDateMonth.value = task.month || '';
                editDueDateYear.value = task.year || '';
            } else {
                console.error('Edit task overlay input elements are missing');
            }

            const editStatusRadios = document.querySelectorAll('input[name="status-option"]');
            const editStatusDisplay = document.getElementById('edit-status-display');
            const editStatusInput = document.getElementById('edit-status-input');

            editStatusRadios.forEach(function (radio) {
                if (radio.value === task.status) {
                    radio.checked = true;
                    editStatusDisplay.textContent = task.status;
                    editStatusInput.value = task.status; // Set hidden input to the current status
                }
            });

            const viewTaskOverlay = document.getElementById('view-task-overlay');
            if (viewTaskOverlay) {
                viewTaskOverlay.setAttribute('data-task-id', taskId);
                viewTaskOverlay.classList.remove('hide');
                activeOverlay = viewTaskOverlay;
                document.body.classList.add('overflow-hidden');
            } else {
                console.error('View task overlay element is missing');
            }
        })
        .catch(error => console.error('Error fetching task:', error));
}

// Event listener for clicking a task item
document.addEventListener("click", (event) => {
    const taskItem = event.target.closest(".task-item");

    if (taskItem) {
        const taskId = taskItem.getAttribute('data-task-id');
        if (taskId) {
            openTaskOverlay(taskId); // Open overlay and populate it
            console.log("Clicked Task ID:", taskId); // Log the clicked task ID to the console
        } else {
            console.error("Task ID is missing from the clicked task item.");
        }
    }
});

// // Event listener for the "Edit" button
// document.getElementById("edit_button").addEventListener("click", (event) => {
//     const taskId = document.getElementById('view-task-overlay').getAttribute('data-task-id');
//     if (taskId) {
//         updateTask(taskId); // Send PUT request to update task
//     } else {
//         console.error("Task ID is missing, cannot update task.");
//     }
// });


// Event listener for the "Edit" button
document.getElementById("edit_button").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const taskId = document.getElementById('view-task-overlay').getAttribute('data-task-id');
    if (taskId) {
        updateTask(taskId); // Send PUT request to update task
    } else {
        console.error("Task ID is missing, cannot update task.");
    }
});



// Delete Task
deleteTaskCTA.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default action to avoid any unintended behavior

    if (activeOverlay) {
        const taskId = activeOverlay.getAttribute("data-task-id");

        console.log("Attempting to delete Task ID:", taskId); // Log task ID for debugging

        if (!taskId) {
            console.error("Task ID is missing!");
            return;
        }

        const userId = localStorage.getItem('user_id');

        try {
            const response = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                await fetchTasksAndRender();

                activeOverlay.classList.add("hide");
                activeOverlay = null;
                document.body.classList.remove("overflow-hidden");

                notification.classList.add("show");
                setTimeout(() => {
                    notification.classList.remove("show");
                }, 3000);
            } else {
                console.error('Failed to delete task:', response.status, await response.text());
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
});





// Display tasks in the UI
function displayTask(task) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-description', task.description);
    taskItem.setAttribute('data-task-id', task._id);

    const taskButton = document.createElement('button');
    taskButton.className = 'task-button';

    const taskDetailsDiv = document.createElement('div');

    const taskNameP = document.createElement('p');
    taskNameP.className = 'task-name';
    taskNameP.textContent = task.name;

    const taskDueDateP = document.createElement('p');
    taskDueDateP.className = 'task-due-date';
    taskDueDateP.textContent = `Due on ${task.month}/${task.day}/${task.year}`;

    taskDetailsDiv.appendChild(taskNameP);
    taskDetailsDiv.appendChild(taskDueDateP);

    const arrowIcon = document.createElement('iconify-icon');
    arrowIcon.setAttribute('icon', 'ion:chevron-forward-outline');
    arrowIcon.setAttribute('aria-hidden', 'true');

    taskButton.appendChild(taskDetailsDiv);
    taskButton.appendChild(arrowIcon);
    taskItem.appendChild(taskButton);

    const taskList = task.status === 'Doing' ? doingList : task.status === 'Done' ? doneList : todoList;
    taskList.appendChild(taskItem);
}

// Initialize the task manager by fetching tasks
(async () => {
  const userId = localStorage.getItem("user_id");

  try {
    const response = await fetch(`/api/users/${userId}/tasks`);

    if (response.ok) {
      const tasks = await response.json();
      tasks.forEach(task => {
        displayTask(task);
      });
    } else {
      console.error('Failed to fetch tasks:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();




