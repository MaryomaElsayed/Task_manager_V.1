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
            _id: this._id, // Ensure the _id is included
            name: this.name,
            description: this.description,
            dueDate: this.dueDate,
            status: this.status
        };
    }
}

// The current active overlay
let activeOverlay = null;

// IMPORTAAAAAAAAAAAAAAN FUNCTION **********
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



deleteTaskCTA.addEventListener("click", async () => {
    if (activeOverlay) {
        const taskId = activeOverlay.getAttribute("data-task-id");

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
                // Task deleted successfully, now re-fetch tasks
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



// Function to display tasks in the UI
function displayTask(task) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-description', task.description);
    taskItem.setAttribute('data-task-id', task._id); // Ensure the task ID is set here

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

