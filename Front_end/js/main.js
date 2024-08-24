
//WORKIIIIIIIIINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNGGGGGGGGGGGGGGGGGGGGG
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

// Event Listeners

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
    statusSelect.querySelector("span").textContent = selectedStatus;
    statusDropdown.classList.add("hide");
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

// Click a task to view details
document.addEventListener("click", (event) => {
  const taskItem = event.target.closest(".task-item");

  if (taskItem) {
    const taskId = taskItem.getAttribute('data-task-id');
    const taskName = taskItem.querySelector(".task-name").textContent;
    //const taskDueDate = taskItem.querySelector(".task-due-date").textContent;
    const taskStatus = taskItem.closest(".tasks-list").classList.contains("pink") ? "To do" :
                       taskItem.closest(".tasks-list").classList.contains("blue") ? "Doing" : "Done";
    const taskDescription = taskItem.getAttribute("data-description");

    viewTaskOverlay.querySelector("#task_name").textContent = taskName;
    viewTaskOverlay.querySelector("#task_description").textContent = taskDescription;
    //viewTaskOverlay.querySelector("#task_due_date").textContent = taskDueDate;
    viewTaskOverlay.querySelector("#task_status span:last-child").textContent = taskStatus;

    viewTaskOverlay.setAttribute("data-task-id", taskId);

    viewTaskOverlay.classList.remove("hide");
    activeOverlay = viewTaskOverlay;
    document.body.classList.add("overflow-hidden");
  }
});

// Delete Task
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




