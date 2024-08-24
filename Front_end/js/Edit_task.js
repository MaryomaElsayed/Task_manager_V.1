// // Elements
// const editStatusSelect = document.getElementById("status-select");
// const editStatusDropdown = document.getElementById("status-dropdown");
// const editStatusRadios = document.querySelectorAll("input[name='status-option']");
// const editStatusInput = document.getElementById("status-input"); // Hidden input
// const editStatusDisplay = document.getElementById("status-display"); // Span for display

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Fetch and populate the edit form with task details
// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("edit_button").addEventListener("click", async function() {
//     const taskId = document.getElementById("view-task-overlay").getAttribute("data-task-id");

//     if (taskId) {
//       const userId = localStorage.getItem("user_id");
//       if (userId) {
//         try {
//           const response = await fetch(`/api/users/${userId}/tasks/${taskId}`);
//           if (response.ok) {
//             const taskDetails = await response.json();
//             console.log("Task Details:", taskDetails);

//             // Update DOM with task details
//             document.getElementById("task_name").outerHTML = `<input type="text" id="task_name" class="input white-background" value="${taskDetails.name || ''}" placeholder="Task Name">`;

//             document.getElementById("task_description").outerHTML = `<textarea id="task_description" class="textarea-input white-background" placeholder="Task Description">${taskDetails.description || ''}</textarea>`;

//             document.getElementById("task_due_date").outerHTML = `
//               <div class="divided-inputs-container">
//                 <div>
//                   <label for="due-date-day" class="secondary-label">Day</label>
//                   <input type="number" id="due-date-day" class="input white-background" value="${taskDetails.day || ''}" required min="1" max="31">
//                 </div>
//                 <div>
//                   <label for="due-date-month" class="secondary-label">Month</label>
//                   <input type="number" id="due-date-month" class="input white-background" value="${taskDetails.month || ''}" required min="1" max="12">
//                 </div>
//                 <div>
//                   <label for="due-date-year" class="secondary-label">Year</label>
//                   <input type="number" id="due-date-year" class="input white-background" value="${taskDetails.year || ''}" required min="1900" max="2100">
//                 </div>
//               </div>
//             `;

//             document.getElementById("task_status").outerHTML = `
//               <select id="edit-status-select" class="input white-background">
//                 <option value="Todo" ${taskDetails.status === 'Todo' ? 'selected' : ''}>Todo</option>
//                 <option value="Doing" ${taskDetails.status === 'Doing' ? 'selected' : ''}>Doing</option>
//                 <option value="Done" ${taskDetails.status === 'Done' ? 'selected' : ''}>Done</option>
//               </select>
//             `;

//             // Add submit button if it doesn't exist
//             if (!document.getElementById("submit_button")) {
//               const submitButton = document.createElement("button");
//               submitButton.id = "submit_button";
//               submitButton.className = "button submit-button icon-button";
//               submitButton.textContent = "Submit";

//               // Add submit button to the control buttons container
//               document.querySelector(".control-buttons-container").appendChild(submitButton);

//               // Add event listener to handle the PUT request when submit is clicked
//               submitButton.addEventListener("click", async function() {
//                 // Capture new values from input fields with updated IDs
//                 const name = document.getElementById("task_name").value;
//                 const description = document.getElementById("task_description").value.trim();
//                 const day = document.getElementById("due-date-day").value.trim();
//                 const month = document.getElementById("due-date-month").value.trim();
//                 const year = document.getElementById("due-date-year").value.trim();
//                 const status = document.getElementById("edit-status-select").value;

//                 console.log("Updated Task Values:", { name, description, day, month, year, status }); // Log values to debug

//                 try {
//                   const putResponse = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
//                     method: "PUT",
//                     headers: {
//                       "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({ name, description, day, month, year, status })
//                   });

//                   if (putResponse.ok) {
//                     const updatedTaskData = await putResponse.json();
//                     console.log("Task updated successfully:", updatedTaskData);

//                     // Close the overlay
//                     const activeOverlay = document.getElementById("view-task-overlay");
//                     if (activeOverlay) {
//                       activeOverlay.classList.add("hide");
//                       document.body.classList.remove("overflow-hidden");
//                     }

//                     // Re-fetch tasks and render them
//                     await fetchTasksAndRender();

//                     // Show notification
//                     const notification = document.getElementById("notification");
//                     if (notification) {
//                       notification.classList.add("show");
//                       setTimeout(() => {
//                         notification.classList.remove("show");
//                       }, 3000);
//                     }
//                   } else {
//                     console.error(`Failed to update task: ${putResponse.statusText}`);
//                   }
//                 } catch (error) {
//                   console.error('Error updating task:', error);
//                 }
//               });
//             }
//           } else {
//             console.error(`Failed to fetch task details: ${response.statusText}`);
//           }
//         } catch (error) {
//           console.error('Error fetching task details:', error);
//         }
//       } else {
//         console.error("User ID is missing!");
//       }
//     } else {
//       console.error("Task ID is missing!");
//     }
//   });
// });

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Add event listeners to the new input fields
// document.addEventListener("DOMContentLoaded", function() {
//   const nameField = document.getElementById("task_name");
//   const descriptionField = document.getElementById("task_description");
//   const dayField = document.getElementById("due-date-day");
//   const monthField = document.getElementById("due-date-month");
//   const yearField = document.getElementById("due-date-year");

//   if (nameField) {
//     nameField.addEventListener('input', function() {
//       console.log('Name changed:', nameField.value);
//     });
//   }

//   if (descriptionField) {
//     descriptionField.addEventListener('input', function() {
//       console.log('Description changed:', descriptionField.value);
//     });
//   }

//   if (dayField) {
//     dayField.addEventListener('input', function() {
//       console.log('Day changed:', dayField.value);
//     });
//   }

//   if (monthField) {
//     monthField.addEventListener('input', function() {
//       console.log('Month changed:', monthField.value);
//     });
//   }

//   if (yearField) {
//     yearField.addEventListener('input', function() {
//       console.log('Year changed:', yearField.value);
//     });
//   }
// });

// // Fetch and render tasks
// async function fetchTasksAndRender() {
//   const userId = localStorage.getItem("user_id");

//   try {
//     const response = await fetch(`/api/users/${userId}/tasks`);
//     if (response.ok) {
//       const tasks = await response.json();
//       // Clear current tasks
//       todoList.innerHTML = '';
//       doingList.innerHTML = '';
//       doneList.innerHTML = '';
//       // Render tasks
//       tasks.forEach(task => {
//         displayTask(task);
//       });
//     } else {
//       console.error('Failed to fetch tasks:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }










































// // Elements
// const editStatusSelect = document.getElementById("status-select");
// const editStatusDropdown = document.getElementById("status-dropdown");
// const editStatusRadios = document.querySelectorAll("input[name='status-option']");
// const editStatusInput = document.getElementById("status-input"); // Hidden input
// const editStatusDisplay = document.getElementById("status-display"); // Span for display

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Fetch and populate the edit form with task details
// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("edit_button").addEventListener("click", async function() {
//     const taskId = document.getElementById("view-task-overlay").getAttribute("data-task-id");

//     if (taskId) {
//       const userId = localStorage.getItem("user_id");
//       if (userId) {
//         try {
//           const response = await fetch(`/api/users/${userId}/tasks/${taskId}`);
//           if (response.ok) {
//             const taskDetails = await response.json();
//             console.log("Task Details:", taskDetails);

//             // Update DOM with task details
//             document.getElementById("task_name").outerHTML = `<input type="text" id="task_name" class="input white-background" value="${taskDetails.name || ''}" placeholder="Task Name">`;

//             document.getElementById("task_description").outerHTML = `<textarea id="task_description" class="textarea-input white-background" placeholder="Task Description">${taskDetails.description || ''}</textarea>`;

//             document.getElementById("task_due_date").outerHTML = `
//               <div class="divided-inputs-container">
//                 <div>
//                   <label for="due-date-day" class="secondary-label">Day</label>
//                   <input type="number" id="due-date-day" class="input white-background" value="${taskDetails.day || ''}" required min="1" max="31">
//                 </div>
//                 <div>
//                   <label for="due-date-month" class="secondary-label">Month</label>
//                   <input type="number" id="due-date-month" class="input white-background" value="${taskDetails.month || ''}" required min="1" max="12">
//                 </div>
//                 <div>
//                   <label for="due-date-year" class="secondary-label">Year</label>
//                   <input type="number" id="due-date-year" class="input white-background" value="${taskDetails.year || ''}" required min="1900" max="2100">
//                 </div>
//               </div>
//             `;

//             document.getElementById("task_status").outerHTML = `
//               <select id="edit-status-select" class="input white-background">
//                 <option value="Todo" ${taskDetails.status === 'Todo' ? 'selected' : ''}>Todo</option>
//                 <option value="Doing" ${taskDetails.status === 'Doing' ? 'selected' : ''}>Doing</option>
//                 <option value="Done" ${taskDetails.status === 'Done' ? 'selected' : ''}>Done</option>
//               </select>
//             `;

//             // Add submit button if it doesn't exist
//             if (!document.getElementById("submit_button")) {
//               const submitButton = document.createElement("button");
//               submitButton.id = "submit_button";
//               submitButton.className = "button submit-button icon-button";
//               submitButton.textContent = "Submit";

//               // Add submit button to the control buttons container
//               document.querySelector(".control-buttons-container").appendChild(submitButton);

//               // Add event listener to handle the PUT request when submit is clicked
//               submitButton.addEventListener("click", async function() {
//                 // Capture new values from input fields with updated IDs
//                 const name = document.getElementById("task_name").value;
//                 const description = document.getElementById("task_description").value.trim();
//                 const day = document.getElementById("due-date-day").value.trim();
//                 const month = document.getElementById("due-date-month").value.trim();
//                 const year = document.getElementById("due-date-year").value.trim();
//                 const status = document.getElementById("edit-status-select").value;

//                 console.log("Updated Task Values:", { name, description, day, month, year, status }); // Log values to debug

//                 try {
//                   const putResponse = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
//                     method: "PUT",
//                     headers: {
//                       "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({ name, description, day, month, year, status })
//                   });

//                   if (putResponse.ok) {
//                     const updatedTaskData = await putResponse.json();
//                     console.log("Task updated successfully:", updatedTaskData);

//                     // Close the overlay
//                     const activeOverlay = document.getElementById("view-task-overlay");
//                     if (activeOverlay) {
//                       activeOverlay.classList.add("hide");
//                       document.body.classList.remove("overflow-hidden");
//                     }

//                     // Re-fetch tasks and render them
//                     await fetchTasksAndRender();

//                     // Show notification
//                     const notification = document.getElementById("notification");
//                     if (notification) {
//                       notification.classList.add("show");
//                       setTimeout(() => {
//                         notification.classList.remove("show");
//                       }, 3000);
//                     }
//                   } else {
//                     console.error(`Failed to update task: ${putResponse.statusText}`);
//                   }
//                 } catch (error) {
//                   console.error('Error updating task:', error);
//                 }
//               });
//             }
//           } else {
//             console.error(`Failed to fetch task details: ${response.statusText}`);
//           }
//         } catch (error) {
//           console.error('Error fetching task details:', error);
//         }
//       } else {
//         console.error("User ID is missing!");
//       }
//     } else {
//       console.error("Task ID is missing!");
//     }
//   });
// });

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Add event listeners to the new input fields
// document.addEventListener("DOMContentLoaded", function() {
//   const nameField = document.getElementById("task_name");
//   const descriptionField = document.getElementById("task_description");
//   const dayField = document.getElementById("due-date-day");
//   const monthField = document.getElementById("due-date-month");
//   const yearField = document.getElementById("due-date-year");

//   if (nameField) {
//     nameField.addEventListener('input', function() {
//       console.log('Name changed:', nameField.value);
//     });
//   }

//   if (descriptionField) {
//     descriptionField.addEventListener('input', function() {
//       console.log('Description changed:', descriptionField.value);
//     });
//   }

//   if (dayField) {
//     dayField.addEventListener('input', function() {
//       console.log('Day changed:', dayField.value);
//     });
//   }

//   if (monthField) {
//     monthField.addEventListener('input', function() {
//       console.log('Month changed:', monthField.value);
//     });
//   }

//   if (yearField) {
//     yearField.addEventListener('input', function() {
//       console.log('Year changed:', yearField.value);
//     });
//   }
// });

// // Fetch and render tasks
// async function fetchTasksAndRender() {
//   const userId = localStorage.getItem("user_id");

//   try {
//     const response = await fetch(`/api/users/${userId}/tasks`);
//     if (response.ok) {
//       const tasks = await response.json();
//       // Clear current tasks
//       todoList.innerHTML = '';
//       doingList.innerHTML = '';
//       doneList.innerHTML = '';
//       // Render tasks
//       tasks.forEach(task => {
//         displayTask(task);
//       });
//     } else {
//       console.error('Failed to fetch tasks:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }





























































// WORKINNNNNNNNNNNNNNNNNNNNNNNG
// // Elements
// const editStatusSelect = document.getElementById("status-select");
// const editStatusDropdown = document.getElementById("status-dropdown");
// const editStatusRadios = document.querySelectorAll("input[name='status-option']");
// const editStatusInput = document.getElementById("status-input"); // Hidden input
// const editStatusDisplay = document.getElementById("status-display"); // Span for display

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Fetch and populate the edit form with task details
// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("edit_button").addEventListener("click", async function() {
//     const taskId = document.getElementById("view-task-overlay").getAttribute("data-task-id");

//     if (taskId) {
//       const userId = localStorage.getItem("user_id");
//       if (userId) {
//         try {
//           const response = await fetch(`/api/users/${userId}/tasks/${taskId}`);
//           if (response.ok) {
//             const taskDetails = await response.json();
//             console.log("Task Details:", taskDetails);

//             // Update DOM with task details
//             document.getElementById("task_name").outerHTML = `<input type="text" id="update_name" class="input white-background" value="${taskDetails.name || ''}" placeholder="Task Name">`;

//             document.getElementById("task_description").outerHTML = `<textarea id="update_description" class="textarea-input white-background" placeholder="Task Description">${taskDetails.description || ''}</textarea>`;
//             document.getElementById("task_due_date").outerHTML = `
//               <div class="divided-inputs-container">
//                 <div>
//                   <label for="due-date-day" class="secondary-label">Day</label>
//                   <input type="number" id="update_due-date-day" class="input white-background" value="${taskDetails.day || ''}" required min="1" max="31">
//                 </div>
//                 <div>
//                   <label for="due-date-month" class="secondary-label">Month</label>
//                   <input type="number" id="update_due-date-month" class="input white-background" value="${taskDetails.month || ''}" required min="1" max="12">
//                 </div>
//                 <div>
//                   <label for="due-date-year" class="secondary-label">Year</label>
//                   <input type="number" id="update_due-date-year" class="input white-background" value="${taskDetails.year || ''}" required min="1900" max="2100">
//                 </div>
//               </div>
//             `;
//             document.getElementById("task_status").outerHTML = `
//               <select id="edit-status-select" class="input white-background">
//                 <option value="Todo" ${taskDetails.status === 'Todo' ? 'selected' : ''}>Todo</option>
//                 <option value="Doing" ${taskDetails.status === 'Doing' ? 'selected' : ''}>Doing</option>
//                 <option value="Done" ${taskDetails.status === 'Done' ? 'selected' : ''}>Done</option>
//               </select>
//             `;

//             if (!document.getElementById("submit_button")) {
//               const submitButton = document.createElement("button");
//               submitButton.id = "submit_button";
//               submitButton.className = "button submit-button icon-button";
//               submitButton.textContent = "Submit";

//               // Add submit button to the control buttons container
//               document.querySelector(".control-buttons-container").appendChild(submitButton);

//               // Add event listener to handle the PUT request when submit is clicked
//               submitButton.addEventListener("click", async function() {
//                 // Capture new values from input fields
//                 const name = document.getElementById("update_name").value;
//                 const description = document.getElementById("update_description").value.trim();
//                 const day = document.getElementById("update_due-date-day").value.trim();
//                 const month = document.getElementById("update_due-date-month").value.trim();
//                 const year = document.getElementById("update_due-date-year").value.trim();
//                 const status = document.getElementById("edit-status-select").value;

//                 console.log("Updated Task Values:", { name, description, day, month, year, status }); // Log values to debug

//                 try {
//                   const putResponse = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
//                     method: "PUT",
//                     headers: {
//                       "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({ name, description, day, month, year, status })
//                   });

//                   if (putResponse.ok) {
//                     const updatedTaskData = await putResponse.json();
//                     console.log("Task updated successfully:", updatedTaskData);
                    
//                     // Close the overlay
//                     const activeOverlay = document.getElementById("view-task-overlay");
//                     if (activeOverlay) {
//                       activeOverlay.classList.add("hide");
//                       document.body.classList.remove("overflow-hidden");
//                     }

//                     // Re-fetch tasks and render them
//                     await fetchTasksAndRender();

//                     // Show notification
//                     const notification = document.getElementById("notification");
//                     if (notification) {
//                       notification.classList.add("show");
//                       setTimeout(() => {
//                         notification.classList.remove("show");
//                       }, 3000);
//                     }
//                   } else {
//                     console.error(`Failed to update task: ${putResponse.statusText}`);
//                   }
//                 } catch (error) {
//                   console.error('Error updating task:', error);
//                 }
//               });
//             }
//           } else {
//             console.error(`Failed to fetch task details: ${response.statusText}`);
//           }
//         } catch (error) {
//           console.error('Error fetching task details:', error);
//         }
//       } else {
//         console.error("User ID is missing!");
//       }
//     } else {
//       console.error("Task ID is missing!");
//     }
//   });
// });

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Add event listeners to the new input fields
// document.addEventListener("DOMContentLoaded", function() {
//   const nameField = document.getElementById("update_name");
//   const descriptionField = document.getElementById("update_description");
//   const dayField = document.getElementById("update_due-date-day");
//   const monthField = document.getElementById("update_due-date-month");
//   const yearField = document.getElementById("update_due-date-year");

//   if (nameField) {
//     nameField.addEventListener('input', function() {
//       console.log('Name changed:', nameField.value);
//     });
//   }

//   if (descriptionField) {
//     descriptionField.addEventListener('input', function() {
//       console.log('Description changed:', descriptionField.value);
//     });
//   }

//   if (dayField) {
//     dayField.addEventListener('input', function() {
//       console.log('Day changed:', dayField.value);
//     });
//   }

//   if (monthField) {
//     monthField.addEventListener('input', function() {
//       console.log('Month changed:', monthField.value);
//     });
//   }

//   if (yearField) {
//     yearField.addEventListener('input', function() {
//       console.log('Year changed:', yearField.value);
//     });
//   }
// });

// // Fetch and render tasks
// async function fetchTasksAndRender() {
//     const userId = localStorage.getItem("user_id");

//     try {
//         const response = await fetch(`/api/users/${userId}/tasks`);
//         if (response.ok) {
//             const tasks = await response.json();
//             // Clear current tasks
//             todoList.innerHTML = '';
//             doingList.innerHTML = '';
//             doneList.innerHTML = '';
//             // Render tasks
//             tasks.forEach(task => {
//                 displayTask(task);
//             });
//         } else {
//             console.error('Failed to fetch tasks:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }



























// // Elements
// const editStatusSelect = document.getElementById("status-select");
// const editStatusDropdown = document.getElementById("status-dropdown");
// const editStatusRadios = document.querySelectorAll("input[name='status-option']");
// const editStatusInput = document.getElementById("status-input"); // Hidden input
// const editStatusDisplay = document.getElementById("status-display"); // Span for display

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   if (editStatusDropdown) {
//     editStatusDropdown.classList.toggle("hide");
//   }
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     if (editStatusInput) {
//       editStatusInput.value = selectedStatus; // Update hidden input
//     }
//     if (editStatusDisplay) {
//       editStatusDisplay.textContent = selectedStatus; // Update display
//     }
//     if (editStatusDropdown) {
//       editStatusDropdown.classList.add("hide");
//     }
//   });
// });

// // Fetch and render tasks
// async function fetchTasksAndRender() {
//     const userId = localStorage.getItem("user_id");

//     try {
//         const response = await fetch(`/api/users/${userId}/tasks`);
//         if (response.ok) {
//             const tasks = await response.json();
//             // Clear current tasks
//             todoList.innerHTML = '';
//             doingList.innerHTML = '';
//             doneList.innerHTML = '';
//             // Render tasks
//             tasks.forEach(task => {
//                 displayTask(task);
//             });
//         } else {
//             console.error('Failed to fetch tasks:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Fetch and populate the edit form with task details
// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("edit_button").addEventListener("click", async function() {
//     const taskId = document.getElementById("view-task-overlay").getAttribute("data-task-id");

//     if (taskId) {
//       const userId = localStorage.getItem("user_id");
//       if (userId) {
//         try {
//           const response = await fetch(`/api/users/${userId}/tasks/${taskId}`);
//           if (response.ok) {
//             const taskDetails = await response.json();
//             console.log("Task Details:", taskDetails);

//             // Update DOM with task details
//             document.getElementById("task_name").outerHTML = `<input type="text" id="update_name" class="input white-background" value="${taskDetails.name || ''}" placeholder="Task Name">`;

//             document.getElementById("task_description").outerHTML = `<textarea id="update_description" class="textarea-input white-background" placeholder="Task Description">${taskDetails.description || ''}</textarea>`;
//             document.getElementById("task_due_date").outerHTML = `
//               <div class="divided-inputs-container">
//                 <div>
//                   <label for="due-date-day" class="secondary-label">Day</label>
//                   <input type="number" id="update_due-date-day" class="input white-background" value="${taskDetails.day || ''}" required min="1" max="31">
//                 </div>
//                 <div>
//                   <label for="due-date-month" class="secondary-label">Month</label>
//                   <input type="number" id="update_due-date-month" class="input white-background" value="${taskDetails.month || ''}" required min="1" max="12">
//                 </div>
//                 <div>
//                   <label for="due-date-year" class="secondary-label">Year</label>
//                   <input type="number" id="update_due-date-year" class="input white-background" value="${taskDetails.year || ''}" required min="1900" max="2100">
//                 </div>
//               </div>
//             `;
//             document.getElementById("task_status").outerHTML = `
//               <select id="edit-status-select" class="input white-background">
//                 <option value="Todo" ${taskDetails.status === 'Todo' ? 'selected' : ''}>Todo</option>
//                 <option value="Doing" ${taskDetails.status === 'Doing' ? 'selected' : ''}>Doing</option>
//                 <option value="Done" ${taskDetails.status === 'Done' ? 'selected' : ''}>Done</option>
//               </select>
//             `;

//             if (!document.getElementById("submit_button")) {
//               const submitButton = document.createElement("button");
//               submitButton.id = "submit_button";
//               submitButton.className = "button submit-button icon-button";
//               submitButton.textContent = "Submit";

//               // Add submit button to the control buttons container
//               document.querySelector(".control-buttons-container").appendChild(submitButton);

//               // Add event listener to handle the PUT request when submit is clicked
//               submitButton.addEventListener("click", async function() {
//                 // Capture new values from input fields
//                 const name = document.getElementById("update_name").value;
//                 const description = document.getElementById("update_description").value.trim();
//                 const day = document.getElementById("update_due-date-day").value.trim();
//                 const month = document.getElementById("update_due-date-month").value.trim();
//                 const year = document.getElementById("update_due-date-year").value.trim();
//                 const status = document.getElementById("edit-status-select").value;

//                 console.log("Updated Task Values:", { name, description, day, month, year, status }); // Log values to debug

//                 try {
//                   const putResponse = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
//                     method: "PUT",
//                     headers: {
//                       "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({ name, description, day, month, year, status })
//                   });

//                   if (putResponse.ok) {
//                     const updatedTaskData = await putResponse.json();
//                     console.log("Task updated successfully:", updatedTaskData);
                    
//                     // Re-fetch tasks and render them
//                     await fetchTasksAndRender();

//                     // Close the overlay
//                     const activeOverlay = document.getElementById("view-task-overlay");
//                     if (activeOverlay) {
//                       activeOverlay.classList.add("hide");
//                       document.body.classList.remove("overflow-hidden");
//                     }

//                     // Show notification
//                     const notification = document.getElementById("notification");
//                     if (notification) {
//                       notification.classList.add("show");
//                       setTimeout(() => {
//                         notification.classList.remove("show");
//                       }, 3000);
//                     }
//                   } else {
//                     console.error(`Failed to update task: ${putResponse.statusText}`);
//                   }
//                 } catch (error) {
//                   console.error('Error updating task:', error);
//                 }
//               });
//             }
//           } else {
//             console.error(`Failed to fetch task details: ${response.statusText}`);
//           }
//         } catch (error) {
//           console.error('Error fetching task details:', error);
//         }
//       } else {
//         console.error("User ID is missing!");
//       }
//     } else {
//       console.error("Task ID is missing!");
//     }
//   });
// });

// // Add event listeners to the new input fields
// document.addEventListener("DOMContentLoaded", function() {
//   const nameField = document.getElementById("update_name");
//   const descriptionField = document.getElementById("update_description");
//   const dayField = document.getElementById("update_due-date-day");
//   const monthField = document.getElementById("update_due-date-month");
//   const yearField = document.getElementById("update_due-date-year");

//   if (nameField) {
//     nameField.addEventListener('input', function() {
//       console.log('Name changed:', nameField.value);
//     });
//   }

//   if (descriptionField) {
//     descriptionField.addEventListener('input', function() {
//       console.log('Description changed:', descriptionField.value);
//     });
//   }

//   if (dayField) {
//     dayField.addEventListener('input', function() {
//       console.log('Day changed:', dayField.value);
//     });
//   }

//   if (monthField) {
//     monthField.addEventListener('input', function() {
//       console.log('Month changed:', monthField.value);
//     });
//   }

//   if (yearField) {
//     yearField.addEventListener('input', function() {
//       console.log('Year changed:', yearField.value);
//     });
//   }
// });




































// // Elements
// const editStatusSelect = document.getElementById("status-select");
// const editStatusDropdown = document.getElementById("status-dropdown");
// const editStatusRadios = document.querySelectorAll("input[name='status-option']");
// const editStatusInput = document.getElementById("status-input"); // Hidden input
// const editStatusDisplay = document.getElementById("status-display"); // Span for display

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Fetch and render tasks
// async function fetchTasksAndRender() {
//     const userId = localStorage.getItem("user_id");

//     try {
//         const response = await fetch(`/api/users/${userId}/tasks`);
//         if (response.ok) {
//             const tasks = await response.json();
//             // Clear current tasks
//             todoList.innerHTML = '';
//             doingList.innerHTML = '';
//             doneList.innerHTML = '';
//             // Render tasks
//             tasks.forEach(task => {
//                 displayTask(task);
//             });
//         } else {
//             console.error('Failed to fetch tasks:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Fetch and populate the edit form with task details
// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("edit_button").addEventListener("click", async function() {
//     const taskId = document.getElementById("view-task-overlay").getAttribute("data-task-id");

//     if (taskId) {
//       const userId = localStorage.getItem("user_id");
//       if (userId) {
//         try {
//           const response = await fetch(`/api/users/${userId}/tasks/${taskId}`);
//           if (response.ok) {
//             const taskDetails = await response.json();
//             console.log("Task Details:", taskDetails);

//             // Update DOM with task details
//             document.getElementById("task_name").outerHTML = `<input type="text" id="update_name" class="input white-background" value="${taskDetails.name || ''}" placeholder="Task Name">`;

//             document.getElementById("task_description").outerHTML = `<textarea id="update_description" class="textarea-input white-background" placeholder="Task Description">${taskDetails.description || ''}</textarea>`;
//             document.getElementById("task_due_date").outerHTML = `
//               <div class="divided-inputs-container">
//                 <div>
//                   <label for="due-date-day" class="secondary-label">Day</label>
//                   <input type="number" id="update_due-date-day" class="input white-background" value="${taskDetails.day || ''}" required min="1" max="31">
//                 </div>
//                 <div>
//                   <label for="due-date-month" class="secondary-label">Month</label>
//                   <input type="number" id="update_due-date-month" class="input white-background" value="${taskDetails.month || ''}" required min="1" max="12">
//                 </div>
//                 <div>
//                   <label for="due-date-year" class="secondary-label">Year</label>
//                   <input type="number" id="update_due-date-year" class="input white-background" value="${taskDetails.year || ''}" required min="1900" max="2100">
//                 </div>
//               </div>
//             `;
//             document.getElementById("task_status").outerHTML = `
//               <select id="edit-status-select" class="input white-background">
//                 <option value="Todo" ${taskDetails.status === 'Todo' ? 'selected' : ''}>Todo</option>
//                 <option value="Doing" ${taskDetails.status === 'Doing' ? 'selected' : ''}>Doing</option>
//                 <option value="Done" ${taskDetails.status === 'Done' ? 'selected' : ''}>Done</option>
//               </select>
//             `;

//             if (!document.getElementById("submit_button")) {
//               const submitButton = document.createElement("button");
//               submitButton.id = "submit_button";
//               submitButton.className = "button submit-button icon-button";
//               submitButton.textContent = "Submit";

//               // Add submit button to the control buttons container
//               document.querySelector(".control-buttons-container").appendChild(submitButton);

//               // Add event listener to handle the PUT request when submit is clicked
//               submitButton.addEventListener("click", async function() {
//                 // Capture new values from input fields
//                 const name = document.getElementById("update_name").value;
//                 const description = document.getElementById("update_description").value.trim();
//                 const day = document.getElementById("update_due-date-day").value.trim();
//                 const month = document.getElementById("update_due-date-month").value.trim();
//                 const year = document.getElementById("update_due-date-year").value.trim();
//                 const status = document.getElementById("edit-status-select").value;

//                 console.log("Updated Task Values:", { name, description, day, month, year, status }); // Log values to debug

//                 try {
//                   const putResponse = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
//                     method: "PUT",
//                     headers: {
//                       "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({ name, description, day, month, year, status })
//                   });

//                   if (putResponse.ok) {
//                     const updatedTaskData = await putResponse.json();
//                     console.log("Task updated successfully:", updatedTaskData);
                    
//                     // Re-fetch tasks and render themmmmmmmmmmm
//                     await fetchTasksAndRender();

//                     // Close the overlay
//                     const activeOverlay = document.getElementById("view-task-overlay");
//                     if (activeOverlay) {
//                       activeOverlay.classList.add("hide");
//                       document.body.classList.remove("overflow-hidden");
//                     }

//                     // Show notification
//                     const notification = document.getElementById("notification");
//                     if (notification) {
//                       notification.classList.add("show");
//                       setTimeout(() => {
//                         notification.classList.remove("show");
//                       }, 3000);
//                     }
//                   } else {
//                     console.error(`Failed to update task: ${putResponse.statusText}`);
//                   }
//                 } catch (error) {
//                   console.error('Error updating task:', error);
//                 }
//               });
//             }
//           } else {
//             console.error(`Failed to fetch task details: ${response.statusText}`);
//           }
//         } catch (error) {
//           console.error('Error fetching task details:', error);
//         }
//       } else {
//         console.error("User ID is missing!");
//       }
//     } else {
//       console.error("Task ID is missing!");
//     }
//   });
// });

// // Add event listeners to the new input fields
// document.addEventListener("DOMContentLoaded", function() {
//   const nameField = document.getElementById("update_name");
//   const descriptionField = document.getElementById("update_description");
//   const dayField = document.getElementById("update_due-date-day");
//   const monthField = document.getElementById("update_due-date-month");
//   const yearField = document.getElementById("update_due-date-year");

//   if (nameField) {
//     nameField.addEventListener('input', function() {
//       console.log('Name changed:', nameField.value);
//     });
//   }

//   if (descriptionField) {
//     descriptionField.addEventListener('input', function() {
//       console.log('Description changed:', descriptionField.value);
//     });
//   }

//   if (dayField) {
//     dayField.addEventListener('input', function() {
//       console.log('Day changed:', dayField.value);
//     });
//   }

//   if (monthField) {
//     monthField.addEventListener('input', function() {
//       console.log('Month changed:', monthField.value);
//     });
//   }

//   if (yearField) {
//     yearField.addEventListener('input', function() {
//       console.log('Year changed:', yearField.value);
//     });
//   }
// });





























// // Elements
// const editStatusSelect = document.getElementById("status-select");
// const editStatusDropdown = document.getElementById("status-dropdown");
// const editStatusRadios = document.querySelectorAll("input[name='status-option']");
// const editStatusInput = document.getElementById("status-input"); // Hidden input
// const editStatusDisplay = document.getElementById("status-display"); // Span for display

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Fetch and populate the edit form with task details
// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("edit_button").addEventListener("click", async function() {
//     const taskId = document.getElementById("view-task-overlay").getAttribute("data-task-id");

//     if (taskId) {
//       const userId = localStorage.getItem("user_id");
//       if (userId) {
//         try {
//           const response = await fetch(`/api/users/${userId}/tasks/${taskId}`);
//           if (response.ok) {
//             const taskDetails = await response.json();
//             console.log("Task Details:", taskDetails);

//             // Update DOM with task details
//             document.getElementById("task_name").outerHTML = `<input type="text" id="update_name" class="input white-background" value="${taskDetails.name || ''}" placeholder="Task Name">`;

//             document.getElementById("task_description").outerHTML = `<textarea id="update_description" class="textarea-input white-background" placeholder="Task Description">${taskDetails.description || ''}</textarea>`;
//             document.getElementById("task_due_date").outerHTML = `
//               <div class="divided-inputs-container">
//                 <div>
//                   <label for="due-date-day" class="secondary-label">Day</label>
//                   <input type="number" id="update_due-date-day" class="input white-background" value="${taskDetails.day || ''}" required min="1" max="31">
//                 </div>
//                 <div>
//                   <label for="due-date-month" class="secondary-label">Month</label>
//                   <input type="number" id="update_due-date-month" class="input white-background" value="${taskDetails.month || ''}" required min="1" max="12">
//                 </div>
//                 <div>
//                   <label for="due-date-year" class="secondary-label">Year</label>
//                   <input type="number" id="update_due-date-year" class="input white-background" value="${taskDetails.year || ''}" required min="1900" max="2100">
//                 </div>
//               </div>
//             `;
//             document.getElementById("task_status").outerHTML = `
//               <select id="edit-status-select" class="input white-background">
//                 <option value="Todo" ${taskDetails.status === 'Todo' ? 'selected' : ''}>Todo</option>
//                 <option value="Doing" ${taskDetails.status === 'Doing' ? 'selected' : ''}>Doing</option>
//                 <option value="Done" ${taskDetails.status === 'Done' ? 'selected' : ''}>Done</option>
//               </select>
//             `;

//             if (!document.getElementById("submit_button")) {
//               const submitButton = document.createElement("button");
//               submitButton.id = "submit_button";
//               submitButton.className = "button submit-button icon-button";
//               submitButton.textContent = "Submit";

//               // Add submit button to the control buttons container
//               document.querySelector(".control-buttons-container").appendChild(submitButton);

//               // Add event listener to handle the PUT request when submit is clicked
//               submitButton.addEventListener("click", async function() {
//                 // Capture new values from input fields
//                 const name = document.getElementById("update_name").value;
//                 const description = document.getElementById("update_description").value.trim();
//                 const day = document.getElementById("update_due-date-day").value.trim();
//                 const month = document.getElementById("update_due-date-month").value.trim();
//                 const year = document.getElementById("update_due-date-year").value.trim();
//                 const status = document.getElementById("edit-status-select").value;

//                 console.log("Updated Task Values:", { name, description, day, month, year, status }); // Log values to debug

//                 try {
//                   const putResponse = await fetch(`/api/users/${userId}/tasks/${taskId}`, {
//                     method: "PUT",
//                     headers: {
//                       "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({ name, description, day, month, year, status })
//                   });

//                   if (putResponse.ok) {
//                     const updatedTaskData = await putResponse.json();
//                     console.log("Task updated successfully:", updatedTaskData);
                    
//                     // Re-fetch tasks and render them
//                     await fetchTasksAndRender();

//                     // Close the overlay
//                     const activeOverlay = document.getElementById("view-task-overlay");
//                     if (activeOverlay) {
//                       activeOverlay.classList.add("hide");
//                       document.body.classList.remove("overflow-hidden");
//                     }

//                     // Show notification
//                     const notification = document.getElementById("notification");
//                     if (notification) {
//                       notification.classList.add("show");
//                       setTimeout(() => {
//                         notification.classList.remove("show");
//                       }, 3000);
//                     }
//                   } else {
//                     console.error(`Failed to update task: ${putResponse.statusText}`);
//                   }
//                 } catch (error) {
//                   console.error('Error updating task:', error);
//                 }
//               });
//             }
//           } else {
//             console.error(`Failed to fetch task details: ${response.statusText}`);
//           }
//         } catch (error) {
//           console.error('Error fetching task details:', error);
//         }
//       } else {
//         console.error("User ID is missing!");
//       }
//     } else {
//       console.error("Task ID is missing!");
//     }
//   });
// });

// // Status dropdown
// editStatusSelect.addEventListener("click", () => {
//   editStatusDropdown.classList.toggle("hide");
// });

// // Status selection
// editStatusRadios.forEach((radio) => {
//   radio.addEventListener("change", (event) => {
//     const selectedStatus = event.target.value;
//     editStatusInput.value = selectedStatus; // Update hidden input
//     editStatusDisplay.textContent = selectedStatus; // Update display
//     editStatusDropdown.classList.add("hide");
//   });
// });

// // Add event listeners to the new input fields
// document.addEventListener("DOMContentLoaded", function() {
//   const nameField = document.getElementById("update_name");
//   const descriptionField = document.getElementById("update_description");
//   const dayField = document.getElementById("update_due-date-day");
//   const monthField = document.getElementById("update_due-date-month");
//   const yearField = document.getElementById("update_due-date-year");

//   if (nameField) {
//     nameField.addEventListener('input', function() {
//       console.log('Name changed:', nameField.value);
//     });
//   }

//   if (descriptionField) {
//     descriptionField.addEventListener('input', function() {
//       console.log('Description changed:', descriptionField.value);
//     });
//   }

//   if (dayField) {
//     dayField.addEventListener('input', function() {
//       console.log('Day changed:', dayField.value);
//     });
//   }

//   if (monthField) {
//     monthField.addEventListener('input', function() {
//       console.log('Month changed:', monthField.value);
//     });
//   }

//   if (yearField) {
//     yearField.addEventListener('input', function() {
//       console.log('Year changed:', yearField.value);
//     });
//   }
// });


