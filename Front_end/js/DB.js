// Task class definition
class Task {
  constructor(name, description, day, month, year, status) {
    this.name = name;
    this.description = description;
    this.day = day;
    this.month = month;
    this.year = year;
    this.status = status;
    this.addedDate = new Date().toISOString();
    this.updatedDate = null; // Initialize as null, will be updated when task is modified
  }

  updateTask(newDetails) {
    Object.assign(this, newDetails);
    this.updatedDate = new Date().toISOString();
  }
}

// User class definition
class User {
  constructor(firstName, lastName, email, password, joiningDate) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.joiningDate = joiningDate;
    this.tasks = []; // Initialize an empty array for tasks
  }

  addTask(task) {
    this.tasks.push(task);
  }
}

// Example usage
// Create a new user
const user = new User('John', 'Doe', 'john.doe@example.com', 'password123', '2024-08-10');

// Create new tasks
const task1 = new Task('Task 1', 'Description of task 1', 10, 8, 2024, 'Pending');
const task2 = new Task('Task 2', 'Description of task 2', 11, 8, 2024, 'Pending');

// Add tasks to the user
user.addTask(task1);
user.addTask(task2);

// Output user data (this is what you would store in MongoDB)
console.log(user);
