// Elements
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

const todoList = document.querySelector(".tasks-list.pink");
const doingList = document.querySelector(".tasks-list.blue");
const doneList = document.querySelector(".tasks-list.green");

class Task {
    constructor(name, description, dueDate, status) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
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

    getDetails() {
        return `${this.name} - ${this.description} (Due: ${this.dueDate}, Status: ${this.status})`;
    }

    toObject() {
        return {
            name: this.name,
            description: this.description,
            dueDate: this.dueDate,
            status: this.status
        };
    }
}

// The current active overlay
let activeOverlay = null;

//** Event Listeners **//

// Radio buttons for view option
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

// Add task
addTaskCTA.addEventListener("click", () => {
  setTaskOverlay.classList.remove("hide");
  activeOverlay = setTaskOverlay;
  document.body.classList.add("overflow-hidden");
});

// Close buttons inside overlays
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (activeOverlay) {
      activeOverlay.classList.add("hide");
      activeOverlay = null;
      document.body.classList.remove("overflow-hidden");
    }
  });
});

// Open status dropdown
statusSelect.addEventListener("click", () => {
  statusDropdown.classList.toggle("hide");
});

// Update status when a status radio is selected
statusRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    const selectedStatus = event.target.value;
    statusSelect.querySelector("span").textContent = selectedStatus;
    statusDropdown.classList.add("hide");
  });
});

// Handle form submission for adding a task
addTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const day = document.getElementById("due-date-day").value;
  const month = document.getElementById("due-date-month").value;
  const year = document.getElementById("due-date-year").value;
  const status = statusSelect.querySelector("span").textContent;

  // Retrieve user_id from local storage
  const userId = localStorage.getItem("user_id");
  console.log('Retrieved user_id:', userId); // Log user_id

  const newTask = {
    user_id: userId,
    name,
    description,
    day,
    month,
    year,
    status,
    added_date: new Date(),
    updated_date: new Date(),
  };

  console.log('Sending Task:', newTask); // Log the task to check the payload

  try {
    const response = await fetch(`/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const task = await response.json();
      console.log('Task added:', task);
      
      // Show a success message or update the UI accordingly
      displayTask(task);
    } else {
      const errorText = await response.text();
      console.error('Failed to add task:', response.status, errorText);
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

// Click a task to view details
document.addEventListener("click", (event) => {
  const taskItem = event.target.closest(".task-item");

  if (taskItem) {
    // Extract task details from the clicked task item
    const taskName = taskItem.querySelector(".task-name").textContent;
    const taskDueDate = taskItem.querySelector(".task-due-date").textContent;
    const taskStatus = taskItem.closest(".tasks-list").classList.contains("pink") ? "To do" :
                       taskItem.closest(".tasks-list").classList.contains("blue") ? "Doing" : "Done";

    // Get the task description from the actual task data
    const taskDescription = taskItem.getAttribute("data-description"); // Assuming you store the description in a data attribute

    // Log the task description to check the data
    console.log(taskDescription);

    // Update the overlay content
    viewTaskOverlay.querySelector("#task_name").textContent = taskName;
    viewTaskOverlay.querySelector("#task_description").textContent = taskDescription;
    viewTaskOverlay.querySelector("#task_due_date").textContent = taskDueDate;
    viewTaskOverlay.querySelector("#task_status span:last-child").textContent = taskStatus;

    // Store the task ID in the overlay
    const taskId = taskItem.getAttribute('data-task-id');
    viewTaskOverlay.setAttribute("data-task-id", taskId);

    // Show the overlay
    viewTaskOverlay.classList.remove("hide");
    activeOverlay = viewTaskOverlay;
    document.body.classList.add("overflow-hidden");
  }
});

// Delete a task
deleteTaskCTA.addEventListener("click", async () => {
    if (activeOverlay) {
        const taskId = activeOverlay.getAttribute("data-task-id");

        if (!taskId) {
            console.error("Task ID is missing!");
            return;
        }

        const userId = localStorage.getItem('user_id');

        if (!userId) {
            console.error("User ID is missing!");
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                console.log('Task deleted successfully');

                // Hide the overlay and update the UI
                activeOverlay.classList.add("hide");
                activeOverlay = null;
                document.body.classList.remove("overflow-hidden");

                // Show a success notification
                notification.classList.add("show");
                setTimeout(() => {
                    notification.classList.remove("show");
                }, 3000);

                // Optionally, remove the task from the UI
                const taskElement = document.querySelector(`.task-item[data-task-id='${taskId}']`);
                if (taskElement) {
                    taskElement.remove();
                }
            } else {
                const errorText = await response.text();
                console.error('Failed to delete task:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
});

// Function to display tasks in the UI
function displayTask(task) {
  const taskItem = document.createElement('li');
  taskItem.className = 'task-item';
  taskItem.setAttribute('data-description', task.description); // Add the description here
  taskItem.setAttribute('data-task-id', task._id); // Store the task ID in a data attribute

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

  taskButton.appendChild(taskDetailsDiv);
  taskItem.appendChild(taskButton);

  // Append the task to the appropriate list based on its status
  if (task.status === "To do") {
    todoList.appendChild(taskItem);
  } else if (task.status === "Doing") {
    doingList.appendChild(taskItem);
  } else if (task.status === "Done") {
    doneList.appendChild(taskItem);
  }
}

// Fetch and display tasks when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user_id");

  try {
    const response = await fetch(`/api/users/${userId}/tasks`);
    const tasks = await response.json();
    
    tasks.forEach((task) => {
      displayTask(task);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
});


















































// // Elements
// const radioViewOptions = document.querySelectorAll("input[name='view-option']");
// const listView = document.getElementById("list-view");
// const boardView = document.getElementById("board-view");
// const addTaskCTA = document.getElementById("add-task-cta");
// const setTaskOverlay = document.getElementById("set-task-overlay");
// const closeButtons = document.querySelectorAll(".close-button");
// const statusSelect = document.getElementById("status-select");
// const statusDropdown = document.getElementById("status-dropdown");
// const statusRadios = document.querySelectorAll("input[name='status-option']");
// const addTaskForm = document.querySelector("#set-task-overlay .form");
// const viewTaskOverlay = document.getElementById("view-task-overlay");
// const deleteTaskCTA = document.getElementById("delete-task-cta");
// const notification = document.getElementById("notification");

// const todoList = document.querySelector(".tasks-list.pink");
// const doingList = document.querySelector(".tasks-list.blue");
// const doneList = document.querySelector(".tasks-list.green");

// class Task {
//     constructor(name, description, dueDate, status) {
//         this.name = name;
//         this.description = description;
//         this.dueDate = dueDate;
//         this.status = status || "To do"; // Default to "To do" if no status is provided
//     }

//     to_do() {
//         this.status = "To do";
//     }

//     doing() {
//         this.status = "Doing";
//     }

//     done() {
//         this.status = "Done";
//     }

//     getDetails() {
//         return `${this.name} - ${this.description} (Due: ${this.dueDate}, Status: ${this.status})`;
//     }

//     toObject() {
//         return {
//             name: this.name,
//             description: this.description,
//             dueDate: this.dueDate,
//             status: this.status
//         };
//     }
// }

// // The current active overlay
// let activeOverlay = null;

// //** Event Listeners **//

// // Radio buttons for view option
// radioViewOptions.forEach((radioButton) => {
//   radioButton.addEventListener("change", (event) => {
//     const viewOption = event.target.value;
//     if (viewOption === "list") {
//       boardView.classList.add("hide");
//       listView.classList.remove("hide");
//     } else if (viewOption === "board") {
//       listView.classList.add("hide");
//       boardView.classList.remove("hide");
//     }
//   });
// });

// // Add task
// addTaskCTA.addEventListener("click", () => {
//   setTaskOverlay.classList.remove("hide");
//   activeOverlay = setTaskOverlay;
//   document.body.classList.add("overflow-hidden");
// });

// // Close buttons inside overlays
// closeButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     if (activeOverlay) {
//       activeOverlay.classList.add("hide");
//       activeOverlay = null;
//       document.body.classList.remove("overflow-hidden");
//     }
//   });
// });

// // Open status dropdown
// statusSelect.addEventListener("click", () => {
//   statusDropdown.classList.toggle("hide");
// });

// // Update status when a status radio is selected
// statusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     statusSelect.querySelector("span").textContent = selectedStatus;
//     statusDropdown.classList.add("hide");
//   });
// });

// // Handle form submission for adding a task
// addTaskForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const name = document.getElementById("name").value;
//   const description = document.getElementById("description").value;
//   const day = document.getElementById("due-date-day").value;
//   const month = document.getElementById("due-date-month").value;
//   const year = document.getElementById("due-date-year").value;
//   const status = statusSelect.querySelector("span").textContent;

//   // Retrieve user_id from local storage
//   const userId = localStorage.getItem("user_id");
//   console.log('Retrieved user_id:', userId); // Log user_id

//   const newTask = {
//     user_id: userId,
//     name,
//     description,
//     day,
//     month,
//     year,
//     status,
//     added_date: new Date(),
//     updated_date: new Date(),
//   };

//   console.log('Sending Task:', newTask); // Log the task to check the payload

//   try {
//     const response = await fetch(`/api/tasks`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newTask),
//     });

//     if (response.ok) {
//       const task = await response.json();
//       console.log('Task added:', task);
      
//       // Show a success message or update the UI accordingly
//       displayTask(task);
//     } else {
//       const errorText = await response.text();
//       console.error('Failed to add task:', response.status, errorText);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }

//   addTaskForm.reset();
//   statusSelect.querySelector("span").textContent = "To do";
//   setTaskOverlay.classList.add("hide");
//   document.body.classList.remove("overflow-hidden");

//   notification.classList.add("show");
//   setTimeout(() => {
//     notification.classList.remove("show");
//   }, 3000);
// });

// // Click a task to view details
// document.addEventListener("click", (event) => {
//   const taskItem = event.target.closest(".task-item");

//   if (taskItem) {
//     // Extract task details from the clicked task item
//     const taskName = taskItem.querySelector(".task-name").textContent;
//     const taskDueDate = taskItem.querySelector(".task-due-date").textContent;
//     const taskStatus = taskItem.closest(".tasks-list").classList.contains("pink") ? "To do" :
//                        taskItem.closest(".tasks-list").classList.contains("blue") ? "Doing" : "Done";

//     // Get the task description from the actual task data
//     const taskDescription = taskItem.getAttribute("data-description"); // Assuming you store the description in a data attribute

//     // Log the task description to check the data
//     console.log(taskDescription);

//     // Update the overlay content
//     viewTaskOverlay.querySelector("#task_name").textContent = taskName;
//     viewTaskOverlay.querySelector("#task_description").textContent = taskDescription;
//     viewTaskOverlay.querySelector("#task_due_date").textContent = taskDueDate;
//     viewTaskOverlay.querySelector("#task_status span:last-child").textContent = taskStatus;

//     // Store the task ID in the overlay
//     const taskId = taskItem.getAttribute('data-task-id');
//     viewTaskOverlay.setAttribute("data-task-id", taskId);

//     // Show the overlay
//     viewTaskOverlay.classList.remove("hide");
//     activeOverlay = viewTaskOverlay;
//     document.body.classList.add("overflow-hidden");
//   }
// });

// // Delete a task
// deleteTaskCTA.addEventListener("click", async () => {
//     if (activeOverlay) {
//         const taskId = activeOverlay.getAttribute("data-task-id");

//         if (!taskId) {
//             console.error("Task ID is missing!");
//             return;
//         }

//         const userId = localStorage.getItem('user_id');

//         if (!userId) {
//             console.error("User ID is missing!");
//             return;
//         }

//         try {
//             const response = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });

//             if (response.ok) {
//                 console.log('Task deleted successfully');

//                 // Hide the overlay and update the UI
//                 activeOverlay.classList.add("hide");
//                 activeOverlay = null;
//                 document.body.classList.remove("overflow-hidden");

//                 // Show a success notification
//                 notification.classList.add("show");
//                 setTimeout(() => {
//                     notification.classList.remove("show");
//                 }, 3000);

//                 // Optionally, remove the task from the UI
//                 const taskElement = document.querySelector(`.task-item[data-task-id='${taskId}']`);
//                 if (taskElement) {
//                     taskElement.remove();
//                 }
//             } else {
//                 const errorText = await response.text();
//                 console.error('Failed to delete task:', response.status, errorText);
//             }
//         } catch (error) {
//             console.error('Error deleting task:', error);
//         }
//     }
// });




// // Function to display tasks in the UI
// function displayTask(task) {
//   const taskItem = document.createElement('li');
//   taskItem.className = 'task-item';
//   taskItem.setAttribute('data-description', task.description); // Add the description here
//   taskItem.setAttribute('data-task-id', task._id); // Store the task ID in a data attribute

//   const taskButton = document.createElement('button');
//   taskButton.className = 'task-button';

//   const taskDetailsDiv = document.createElement('div');

//   const taskNameP = document.createElement('p');
//   taskNameP.className = 'task-name';
//   taskNameP.textContent = task.name;

//   const taskDueDateP = document.createElement('p');
//   taskDueDateP.className = 'task-due-date';
//   taskDueDateP.textContent = `Due on ${task.month}/${task.day}/${task.year}`;

//   taskDetailsDiv.appendChild(taskNameP);
//   taskDetailsDiv.appendChild(taskDueDateP);

//   const arrowIcon = document.createElement('iconify-icon');
//   arrowIcon.setAttribute('icon', 'ion:chevron-forward-outline');
//   arrowIcon.setAttribute('aria-hidden', 'true');

//   taskButton.appendChild(taskDetailsDiv);
//   taskButton.appendChild(arrowIcon);
//   taskItem.appendChild(taskButton);

//   const taskList = task.status === 'Doing' ? doingList : task.status === 'Done' ? doneList : todoList;
//   taskList.appendChild(taskItem);
// }

// // Initialize the task manager by fetching tasks
// (async () => {
//   const userId = localStorage.getItem("user_id");

//   try {
//     const response = await fetch(`/api/users/${userId}/tasks`);

//     if (response.ok) {
//       const tasks = await response.json();
//       tasks.forEach(task => {
//         displayTask(task);
//       });
//     } else {
//       console.error('Failed to fetch tasks:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();









































// // Elements
// const radioViewOptions = document.querySelectorAll("input[name='view-option']");
// const listView = document.getElementById("list-view");
// const boardView = document.getElementById("board-view");
// const addTaskCTA = document.getElementById("add-task-cta");
// const setTaskOverlay = document.getElementById("set-task-overlay");
// const closeButtons = document.querySelectorAll(".close-button");
// const statusSelect = document.getElementById("status-select");
// const statusDropdown = document.getElementById("status-dropdown");
// const statusRadios = document.querySelectorAll("input[name='status-option']");
// const addTaskForm = document.querySelector("#set-task-overlay .form");
// const viewTaskOverlay = document.getElementById("view-task-overlay");
// const deleteTaskCTA = document.getElementById("delete-task-cta");
// const notification = document.getElementById("notification");

// const todoList = document.querySelector(".tasks-list.pink");
// const doingList = document.querySelector(".tasks-list.blue");
// const doneList = document.querySelector(".tasks-list.green");

// class Task {
//     constructor(name, description, dueDate, status) {
//         this.name = name;
//         this.description = description;
//         this.dueDate = dueDate;
//         this.status = status || "To do"; // Default to "To do" if no status is provided
//     }

//     to_do() {
//         this.status = "To do";
//     }

//     doing() {
//         this.status = "Doing";
//     }

//     done() {
//         this.status = "Done";
//     }

//     getDetails() {
//         return `${this.name} - ${this.description} (Due: ${this.dueDate}, Status: ${this.status})`;
//     }

//     toObject() {
//         return {
//             name: this.name,
//             description: this.description,
//             dueDate: this.dueDate,
//             status: this.status
//         };
//     }
// }

// // The current active overlay
// let activeOverlay = null;

// //** Event Listeners **//

// // Radio buttons for view option
// radioViewOptions.forEach((radioButton) => {
//   radioButton.addEventListener("change", (event) => {
//     const viewOption = event.target.value;
//     if (viewOption === "list") {
//       boardView.classList.add("hide");
//       listView.classList.remove("hide");
//     } else if (viewOption === "board") {
//       listView.classList.add("hide");
//       boardView.classList.remove("hide");
//     }
//   });
// });

// // Add task
// addTaskCTA.addEventListener("click", () => {
//   setTaskOverlay.classList.remove("hide");
//   activeOverlay = setTaskOverlay;
//   document.body.classList.add("overflow-hidden");
// });

// // Close buttons inside overlays
// closeButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     if (activeOverlay) {
//       activeOverlay.classList.add("hide");
//       activeOverlay = null;
//       document.body.classList.remove("overflow-hidden");
//     }
//   });
// });

// // Open status dropdown
// statusSelect.addEventListener("click", () => {
//   statusDropdown.classList.toggle("hide");
// });

// // Update status when a status radio is selected
// statusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     statusSelect.querySelector("span").textContent = selectedStatus;
//     statusDropdown.classList.add("hide");
//   });
// });

// // Handle form submission for adding a task
// addTaskForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const name = document.getElementById("name").value;
//   const description = document.getElementById("description").value;
//   const day = document.getElementById("due-date-day").value;
//   const month = document.getElementById("due-date-month").value;
//   const year = document.getElementById("due-date-year").value;
//   const status = statusSelect.querySelector("span").textContent;

//   // Retrieve user_id from local storage
//   const userId = localStorage.getItem("user_id");
//   console.log('Retrieved user_id:', userId); // Log user_id

//   const newTask = {
//     user_id: userId,
//     name,
//     description,
//     day,
//     month,
//     year,
//     status,
//     added_date: new Date(),
//     updated_date: new Date(),
//   };

//   console.log('Sending Task:', newTask); // Log the task to check the payload

//   try {
//     const response = await fetch(`/api/tasks`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newTask),
//     });

//     if (response.ok) {
//       const task = await response.json();
//       console.log('Task added:', task);
      
//       // Show a success message or update the UI accordingly
//       displayTask(task);
//     } else {
//       const errorText = await response.text();
//       console.error('Failed to add task:', response.status, errorText);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }

//   addTaskForm.reset();
//   statusSelect.querySelector("span").textContent = "To do";
//   setTaskOverlay.classList.add("hide");
//   document.body.classList.remove("overflow-hidden");

//   notification.classList.add("show");
//   setTimeout(() => {
//     notification.classList.remove("show");
//   }, 3000);
// });

// // Click a task to view details
// document.addEventListener("click", (event) => {
//   const taskItem = event.target.closest(".task-item");

//   if (taskItem) {
//     // Extract task details from the clicked task item
//     const taskName = taskItem.querySelector(".task-name").textContent;
//     const taskDueDate = taskItem.querySelector(".task-due-date").textContent;
//     const taskStatus = taskItem.closest(".tasks-list").classList.contains("pink") ? "To do" :
//                        taskItem.closest(".tasks-list").classList.contains("blue") ? "Doing" : "Done";

//     // Get the task description from the actual task data
//     const taskDescription = taskItem.getAttribute("data-description"); // Assuming you store the description in a data attribute

//     // Log the task description to check the data
//     console.log(taskDescription);

//     // Update the overlay content
//     viewTaskOverlay.querySelector("#task_name").textContent = taskName;
//     viewTaskOverlay.querySelector("#task_description").textContent = taskDescription;
//     viewTaskOverlay.querySelector("#task_due_date").textContent = taskDueDate;
//     viewTaskOverlay.querySelector("#task_status span:last-child").textContent = taskStatus;

//     // Store the task ID in the overlay
//     const taskId = taskItem.getAttribute('data-task-id');
//     viewTaskOverlay.setAttribute("data-task-id", taskId);

//     // Show the overlay
//     viewTaskOverlay.classList.remove("hide");
//     activeOverlay = viewTaskOverlay;
//     document.body.classList.add("overflow-hidden");
//   }
// });

// // Delete a task
// deleteTaskCTA.addEventListener("click", async () => {
//     if (activeOverlay) {
//         const taskId = activeOverlay.getAttribute("data-task-id");

//         if (!taskId) {
//             console.error("Task ID is missing!");
//             return;
//         }

//         const userId = localStorage.getItem('user_id');

//         try {
//             const response = await fetch(`/api/tasks/${taskId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ user_id: userId })
//             });

//             if (response.ok) {
//                 console.log('Task deleted successfully');

//                 // Hide the overlay and update the UI
//                 activeOverlay.classList.add("hide");
//                 activeOverlay = null;
//                 document.body.classList.remove("overflow-hidden");

//                 // Show a success notification
//                 notification.classList.add("show");
//                 setTimeout(() => {
//                     notification.classList.remove("show");
//                 }, 3000);

//                 // Optionally, remove the task from the UI
//                 document.querySelector(`.task-item[data-task-id='${taskId}']`).remove();
//             } else {
//                 const errorText = await response.text();
//                 console.error('Failed to delete task:', response.status, errorText);
//             }
//         } catch (error) {
//             console.error('Error deleting task:', error);
//         }
//     }
// });

// // Function to display tasks in the UI
// function displayTask(task) {
//   const taskItem = document.createElement('li');
//   taskItem.className = 'task-item';
//   taskItem.setAttribute('data-description', task.description); // Add the description here
//   taskItem.setAttribute('data-task-id', task._id); // Store the task ID in a data attribute

//   const taskButton = document.createElement('button');
//   taskButton.className = 'task-button';

//   const taskDetailsDiv = document.createElement('div');

//   const taskNameP = document.createElement('p');
//   taskNameP.className = 'task-name';
//   taskNameP.textContent = task.name;

//   const taskDueDateP = document.createElement('p');
//   taskDueDateP.className = 'task-due-date';
//   taskDueDateP.textContent = `Due on ${task.month}/${task.day}/${task.year}`;

//   taskDetailsDiv.appendChild(taskNameP);
//   taskDetailsDiv.appendChild(taskDueDateP);

//   const arrowIcon = document.createElement('iconify-icon');
//   arrowIcon.setAttribute('icon', 'ion:chevron-forward-outline');
//   arrowIcon.setAttribute('width', '24');

//   taskButton.appendChild(taskDetailsDiv);
//   taskButton.appendChild(arrowIcon);
//   taskItem.appendChild(taskButton);

//   if (task.status === 'To do') {
//     todoList.appendChild(taskItem);
//   } else if (task.status === 'Doing') {
//     doingList.appendChild(taskItem);
//   } else if (task.status === 'Done') {
//     doneList.appendChild(taskItem);
//   }
// }

// // Fetch and display tasks from the server
// async function fetchAndDisplayTasks() {
//   const userId = localStorage.getItem("user_id");

//   try {
//     const response = await fetch(`/api/users/${userId}/tasks`);
//     if (response.ok) {
//       const tasks = await response.json();
//       tasks.forEach(task => {
//         displayTask(task);
//       });
//     } else {
//       const errorText = await response.text();
//       console.error('Failed to fetch tasks:', response.status, errorText);
//     }
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//   }
// }

// // Call fetchAndDisplayTasks when the page loads
// document.addEventListener("DOMContentLoaded", fetchAndDisplayTasks);









































// // elements
// const radioViewOptions = document.querySelectorAll("input[name='view-option']");
// const listView = document.getElementById("list-view");
// const boardView = document.getElementById("board-view");
// const addTaskCTA = document.getElementById("add-task-cta");
// const setTaskOverlay = document.getElementById("set-task-overlay");
// const closeButtons = document.querySelectorAll(".close-button");
// const statusSelect = document.getElementById("status-select");
// const statusDropdown = document.getElementById("status-dropdown");
// const statusRadios = document.querySelectorAll("input[name='status-option']");
// const addTaskForm = document.querySelector("#set-task-overlay .form");
// const viewTaskOverlay = document.getElementById("view-task-overlay");
// const deleteTaskCTA = document.getElementById("delete-task-cta");
// const notification = document.getElementById("notification");

// const todoList = document.querySelector(".tasks-list.pink");
// const doingList = document.querySelector(".tasks-list.blue");
// const doneList = document.querySelector(".tasks-list.green");

// class Task {
//     constructor(name, description, dueDate, status) {
//         this.name = name;
//         this.description = description;
//         this.dueDate = dueDate;
//         this.status = status || "To do"; // Default to "To do" if no status is provided
//     }

//     to_do() {
//         this.status = "To do";
//     }

//     doing() {
//         this.status = "Doing";
//     }

//     done() {
//         this.status = "Done";
//     }

//     getDetails() {
//         return `${this.name} - ${this.description} (Due: ${this.dueDate}, Status: ${this.status})`;
//     }

//     toObject() {
//         return {
//             name: this.name,
//             description: this.description,
//             dueDate: this.dueDate,
//             status: this.status
//         };
//     }
// }

// // the current active overlay
// let activeOverlay = null;

// //** event listeners **//

// // radio buttons for view option
// radioViewOptions.forEach((radioButton) => {
//   radioButton.addEventListener("change", (event) => {
//     const viewOption = event.target.value;
//     if (viewOption === "list") {
//       boardView.classList.add("hide");
//       listView.classList.remove("hide");
//     } else if (viewOption === "board") {
//       listView.classList.add("hide");
//       boardView.classList.remove("hide");
//     }
//   });
// });

// // add task
// addTaskCTA.addEventListener("click", () => {
//   setTaskOverlay.classList.remove("hide");
//   activeOverlay = setTaskOverlay;
//   document.body.classList.add("overflow-hidden");
// });

// // close buttons inside overlays
// closeButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     if (activeOverlay) {
//       activeOverlay.classList.add("hide");
//       activeOverlay = null;
//       document.body.classList.remove("overflow-hidden");
//     }
//   });
// });

// // open status dropdown
// statusSelect.addEventListener("click", () => {
//   statusDropdown.classList.toggle("hide");
// });

// // update status when a status radio is selected
// statusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     statusSelect.querySelector("span").textContent = selectedStatus;
//     statusDropdown.classList.add("hide");
//   });
// });

// // handle form submission
// addTaskForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const name = document.getElementById("name").value;
//   const description = document.getElementById("description").value;
//   const day = document.getElementById("due-date-day").value;
//   const month = document.getElementById("due-date-month").value;
//   const year = document.getElementById("due-date-year").value;
//   const status = statusSelect.querySelector("span").textContent;

//   // Retrieve user_id from local storage
//   const userId = localStorage.getItem("user_id");
//   console.log('Retrieved user_id:', userId); // Log user_id

//   const newTask = {
//     user_id: userId,
//     name,
//     description,
//     day,
//     month,
//     year,
//     status,
//     added_date: new Date(),
//     updated_date: new Date(),
//   };

//   console.log('Sending Task:', newTask); // Log the task to check the payload

//   try {
//     const response = await fetch(`/api/tasks`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newTask),
//     });

//     if (response.ok) {
//       const task = await response.json();
//       console.log('Task added:', task);
      
//       // Show a success message or update the UI accordingly
//       displayTask(task);
//     } else {
//       const errorText = await response.text();
//       console.error('Failed to add task:', response.status, errorText);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }

//   addTaskForm.reset();
//   statusSelect.querySelector("span").textContent = "To do";
//   setTaskOverlay.classList.add("hide");
//   document.body.classList.remove("overflow-hidden");

//   notification.classList.add("show");
//   setTimeout(() => {
//     notification.classList.remove("show");
//   }, 3000);
// });

// // click a task to view details
// document.addEventListener("click", (event) => {
//   const taskItem = event.target.closest(".task-item");

//   if (taskItem) {
//     // Extract task details from the clicked task item
//     const taskName = taskItem.querySelector(".task-name").textContent;
//     const taskDueDate = taskItem.querySelector(".task-due-date").textContent;
//     const taskStatus = taskItem.closest(".tasks-list").classList.contains("pink") ? "To do" :
//                        taskItem.closest(".tasks-list").classList.contains("blue") ? "Doing" : "Done";

//     // Get the task description from the actual task data
//     const taskDescription = taskItem.getAttribute("data-description"); // Assuming you store the description in a data attribute

//     // Log the task description to check the data
//     console.log(taskDescription);

//     // Update the overlay content
//     viewTaskOverlay.querySelector("#task_name").textContent = taskName;
//     viewTaskOverlay.querySelector("#task_description").textContent = taskDescription;
//     viewTaskOverlay.querySelector("#task_due_date").textContent = taskDueDate;
//     viewTaskOverlay.querySelector("#task_status span:last-child").textContent = taskStatus;

//     // Show the overlay
//     viewTaskOverlay.classList.remove("hide");
//     activeOverlay = viewTaskOverlay;
//     document.body.classList.add("overflow-hidden");
//   }
// });

// console.log("Task ID:", taskId);  // Add this before the DELETE request to verify the task ID


// // Delete a task
// deleteTaskCTA.addEventListener("click", async () => {
//     if (activeOverlay) {
//         const taskId = activeOverlay.getAttribute("data-task-id");

//         if (!taskId) {
//             console.error("Task ID is missing!");
//             return;
//         }

//         const userId = localStorage.getItem('user_id');

//         try {
//             const response = await fetch(`/api/tasks/${taskId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ user_id: userId })
//             });

//             if (response.ok) {
//                 console.log('Task deleted successfully');

//                 // Hide the overlay and update the UI
//                 activeOverlay.classList.add("hide");
//                 activeOverlay = null;
//                 document.body.classList.remove("overflow-hidden");

//                 // Show a success notification
//                 notification.classList.add("show");
//                 setTimeout(() => {
//                     notification.classList.remove("show");
//                 }, 3000);

//                 // Optionally, remove the task from the UI
//                 document.querySelector(`.task-item[data-task-id='${taskId}']`).remove();
//             } else {
//                 const errorText = await response.text();
//                 console.error('Failed to delete task:', response.status, errorText);
//             }
//         } catch (error) {
//             console.error('Error deleting task:', error);
//         }
//     }
// });



// // Function to display tasks in the UIiiiiiiiiiiii
// function displayTask(task) {
//   const taskItem = document.createElement('li');
//   taskItem.className = 'task-item';
//   taskItem.setAttribute('data-description', task.description); // Add the description here

//   const taskButton = document.createElement('button');
//   taskButton.className = 'task-button';

//   const taskDetailsDiv = document.createElement('div');

//   const taskNameP = document.createElement('p');
//   taskNameP.className = 'task-name';
//   taskNameP.textContent = task.name;

//   const taskDueDateP = document.createElement('p');
//   taskDueDateP.className = 'task-due-date';
//   taskDueDateP.textContent = `Due on ${task.month}/${task.day}/${task.year}`;

//   taskDetailsDiv.appendChild(taskNameP);
//   taskDetailsDiv.appendChild(taskDueDateP);

//   const arrowIcon = document.createElement('iconify-icon');
//   arrowIcon.setAttribute('icon', 'material-symbols:arrow-back-ios-rounded');
//   arrowIcon.setAttribute('style', 'color: black');
//   arrowIcon.setAttribute('width', '18');
//   arrowIcon.setAttribute('height', '18');
//   arrowIcon.className = 'arrow-icon';

//   taskButton.appendChild(taskDetailsDiv);
//   taskButton.appendChild(arrowIcon);
//   taskItem.appendChild(taskButton);

//   // Append the task to the correct status list
//   if (task.status === 'To do') {
//     todoList.appendChild(taskItem);
//   } else if (task.status === 'Doing') {
//     doingList.appendChild(taskItem);
//   } else if (task.status === 'Done') {
//     doneList.appendChild(taskItem);
//   }
// }


// // Function to fetch and display tasks
// async function fetchAndDisplayTasks() {
//   const userId = localStorage.getItem('user_id');
//   console.log('Retrieved user_id for fetching tasks:', userId);

//   try {
//     const response = await fetch(`/api/users/${userId}/tasks`);
    
//     // Log the response to understand what's coming back
//     console.log('Response status:', response.status);
//     const tasks = await response.json();
//     console.log('Fetched tasks:', tasks);

//     tasks.forEach(task => {
//       displayTask(task);
//     });
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//   }
// }

// // Call the function to fetch and display tasks when the page loads
// fetchAndDisplayTasks();





