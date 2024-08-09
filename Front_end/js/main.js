// elements
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
const taskItems = document.querySelectorAll(".task-item");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const deleteTaskCTA = document.getElementById("delete-task-cta");
const notification = document.getElementById("notification");

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

// the current active overlay
let activeOverlay = null;

//** event listeners **//

// radio buttons for view option
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

// add task
addTaskCTA.addEventListener("click", () => {
    setTaskOverlay.classList.remove("hide");
    activeOverlay = setTaskOverlay;
    document.body.classList.add("overflow-hidden");
});

// close buttons inside overlays
closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (activeOverlay) {
            activeOverlay.classList.add("hide");
            activeOverlay = null;
            document.body.classList.remove("overflow-hidden");
        }
    });
});

// open status dropdown
statusSelect.addEventListener("click", () => {
    statusDropdown.classList.toggle("hide");
});

// update status when a status radio is selected
statusRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        const selectedStatus = event.target.value;
        statusSelect.querySelector("span").textContent = selectedStatus;
        statusDropdown.classList.add("hide");
    });
});

// handle form submission
addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const day = document.getElementById("due-date-day").value;
    const month = document.getElementById("due-date-month").value;
    const year = document.getElementById("due-date-year").value;
    const status = statusSelect.querySelector("span").textContent;

    const newTask = new Task(name, description, `${day}/${month}/${year}`, status);
    console.log(newTask.getDetails());

    addTaskForm.reset();
    statusSelect.querySelector("span").textContent = "To do";
    setTaskOverlay.classList.add("hide");
    document.body.classList.remove("overflow-hidden");

    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
});

// click a task to view details
taskItems.forEach((task) => {
    task.addEventListener("click", () => {
        viewTaskOverlay.classList.remove("hide");
        activeOverlay = viewTaskOverlay;
        document.body.classList.add("overflow-hidden");
    });
});

// delete a task
deleteTaskCTA.addEventListener("click", () => {
    if (activeOverlay) {
        activeOverlay.classList.add("hide");
        activeOverlay = null;
        document.body.classList.remove("overflow-hidden");
        notification.classList.add("show");
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
});
