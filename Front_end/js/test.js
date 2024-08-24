// Elements
const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const statusSelect = document.getElementById("status-select");
const statusDropdown = document.getElementById("status-dropdown");
const statusRadios = document.querySelectorAll("input[name='status-option']");
const addTaskForm = document.querySelector("#set-task-overlay .form");
const editStatusSelect = document.getElementById("edit-status-select");
const editStatusDropdown = document.getElementById("edit-status-dropdown");
const editStatusRadios = document.querySelectorAll("input[name='edit-status-option']");
const editStatusInput = document.getElementById("edit-status-input");
const editStatusDisplay = document.getElementById("edit-status-display");
const notification = document.getElementById("notification");
const todoList = document.querySelector(".tasks-list.pink");
const doingList = document.querySelector(".tasks-list.blue");
const doneList = document.querySelector(".tasks-list.green");

// Task Class
class Task {
    constructor(name, description, day, month, year, status) {
        this.name = name;
        this.description = description;
        this.day = day;
        this.month = month;
        this.year = year;
        this.status = status || "To do";
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

let activeOverlay = null;

// Fetch and render tasks
async function fetchTasksAndRender() {
    const userId = localStorage.getItem("user_id");

    try {
        const response = await fetch(`/api/users/${userId}/tasks`);
        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        } else {
            showNotification('Failed to fetch tasks: ' + response.statusText, 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

// Render tasks
function renderTasks(tasks) {
    todoList.innerHTML = '';
    doingList.innerHTML = '';
    doneList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        const taskList = getTaskListByStatus(task.status);
        taskList.appendChild(taskElement);
    });
    attachTaskClickListeners();
}

// Create task element
function createTaskElement(task) {
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

    return taskItem;
}

// Get task list by status
function getTaskListByStatus(status) {
    switch (status) {
        case 'Doing':
            return doingList;
        case 'Done':
            return doneList;
        default:
            return todoList;
    }
}

// Attach click listeners to task items
function attachTaskClickListeners() {
    document.querySelectorAll(".task-item").forEach(task => {
        task.addEventListener("click", function() {
            const taskId = this.getAttribute("data-task-id");
            if (taskId) {
                openTaskOverlay(taskId);
            }
        });
    });
}

// Open task overlay
function openTaskOverlay(taskId) {
    viewTaskOverlay.classList.remove("hide");
    document.body.classList.add("overflow-hidden");
    populateTaskDetails(taskId);
}

// Populate task details in the overlay
async function populateTaskDetails(taskId) {
    const userId = localStorage.getItem("user_id");
    if (userId) {
        try {
            const response = await fetch(`/api/users/${userId}/tasks/${taskId}`);
            if (response.ok) {
                const taskDetails = await response.json();
                document.getElementById("update_name").value = taskDetails.name;
                document.getElementById("update_description").value = taskDetails.description;
                document.getElementById("due-date-day").value = taskDetails.day;
                document.getElementById("due-date-month").value = taskDetails.month;
                document.getElementById("due-date-year").value = taskDetails.year;
                editStatusInput.value = taskDetails.status;
                editStatusDisplay.textContent = taskDetails.status;
            } else {
                showNotification('Failed to fetch task details: ' + response.statusText, 'error');
            }
        } catch (error) {
            showNotification('Error fetching task details: ' + error.message, 'error');
        }
    }
}

// Status dropdown for editing
editStatusSelect.addEventListener("click", () => {
    editStatusDropdown.classList.toggle("hide");
});

// Status selection for editing
editStatusRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        const selectedStatus = event.target.value;
        editStatusInput.value = selectedStatus;
        editStatusDisplay.textContent = selectedStatus;
        editStatusDropdown.classList.add("hide");
    });
});

// Save updated task details
document.getElementById("save-button").addEventListener("click", async function() {
    const taskId = viewTaskOverlay.getAttribute("data-task-id");

    if (taskId) {
        const userId = localStorage.getItem("user_id");

        const updatedTask = {
            name: document.getElementById("update_name").value,
            description: document.getElementById("update_description").value,
            day: document.getElementById("due-date-day").value,
            month: document.getElementById("due-date-month").value,
            year: document.getElementById("due-date-year").value,
            status: editStatusInput.value,
            updated_date: new Date(),
        };

        try {
            const response = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                showNotification('Task updated successfully!', 'success');
                fetchTasksAndRender();
                viewTaskOverlay.classList.add("hide");
                document.body.classList.remove("overflow-hidden");
            } else {
                showNotification('Failed to update task: ' + response.statusText, 'error');
            }
        } catch (error) {
            showNotification('Error updating task: ' + error.message, 'error');
        }
    }
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

    const newTask = new Task(name, description, day, month, year, status);

    try {
        const response = await fetch(`/api/users/${userId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask.toObject()),
        });

        if (response.ok) {
            showNotification('Task added successfully!', 'success');
            fetchTasksAndRender();
            setTaskOverlay.classList.add("hide");
            document.body.classList.remove("overflow-hidden");
        } else {
            showNotification('Failed to add task: ' + response.statusText, 'error');
        }
    } catch (error) {
        showNotification('Error adding task: ' + error.message, 'error');
    }
});

// Close overlays on outside click
document.addEventListener("click", (event) => {
    if (activeOverlay && !activeOverlay.contains(event.target) && event.target !== addTaskCTA) {
        activeOverlay.classList.add("hide");
        document.body.classList.remove("overflow-hidden");
        activeOverlay = null;
    }
});

// Status dropdown for adding
statusSelect.addEventListener("click", () => {
    statusDropdown.classList.toggle("hide");
});

// Status selection for adding
statusRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        const selectedStatus = event.target.value;
        statusSelect.querySelector("span").textContent = selectedStatus;
        statusDropdown.classList.add("hide");
    });
});

// Close overlay
closeButtons.forEach(button => {
    button.addEventListener("click", function() {
        if (activeOverlay) {
            activeOverlay.classList.add("hide");
            document.body.classList.remove("overflow-hidden");
            activeOverlay = null;
        }
    });
});

// Open add task overlay
addTaskCTA.addEventListener("click", () => {
    setTaskOverlay.classList.remove("hide");
    document.body.classList.add("overflow-hidden");
    activeOverlay = setTaskOverlay;
});

// Initial fetch
fetchTasksAndRender();
