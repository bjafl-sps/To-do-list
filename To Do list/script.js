// Init variables
// inputBox: DOM element where user inputs caption for new tasks
// listContainer: DOM element that contains tasks as li elements
// tasks: Variable to store current tasklist.
//        Used to sync tasks with localstorage
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
let tasks;

// Try to load tasks from localstorage
// If 'tasks' key in localstorage contains unreadable data, ask user
// if it's ok to clear the data stored under 'tasks' in local storage.
try {
  tasks = loadTasks();
  // Populate DOM with tasks loaded from localstorage
  tasks.forEach((task) => {
    populateHtmlList(task.caption, task.id, task.checked);
  });
} catch {
  // Reading saved tasks failed.
  // Ask user if ok to clear localstorage
  const userConfirmReset = confirm(
    "Error loading saved tasks from local storage. " +
      "Tasks in local storage will be cleared. Do you wish to continue?"
  );
  // Load blank tasks array if user confirms reset
  if (userConfirmReset) {
    tasks = [];
  }
  // Redirect user to blank page if cancel pressed
  window.location.href = "about:blank";
}

// Add click event listner for task list container in DOM
listContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    toggleChecked(e.target);
  } else if (e.target.tagName === "SPAN") {
    removeTask(e.target.parentElement);
  }
});

/**
 * Handle click on add task button.
 * Adds task and clears task name inputbox when clicked.
 * Alerts user and aborts if no task name is provided.
 */
function addTaskBtnClicked() {
  const newTaskName = inputBox.value;
  if (newTaskName === "") {
    alert("You must write something");
  } else {
    addTask(newTaskName);
    inputBox.value = "";
  }
}

/**
 * Add new task to tasks list in DOM and localstorage
 */
function addTask(taskName) {
  // Add task to tasks and save to localstorage
  const id = getNextTaskId();
  tasks.push({
    id: id,
    caption: taskName,
    checked: false,
  });
  saveTasks();
  // Add task to DOM
  populateHtmlList(taskName, id);
}

/**
 * Populate DOM with task element.
 *
 * @param {String} taskName Task caption
 * @param {int} id Task id
 * @param {boolean} checked If task is marked as completed
 */
function populateHtmlList(taskName, id, checked = false) {
  // Create list item for task. Add 'checked' CSS class if task is completed.
  let li = document.createElement("li");
  li.id = id;
  li.innerHTML = taskName;
  if (checked) {
    li.classList.add("checked");
  }
  // Add span with x (button to delete task)
  let span = document.createElement("span");
  span.innerHTML = "\u00d7"; // unicode: x-symbol
  li.appendChild(span);
  // Append new task element to DOM container
  listContainer.appendChild(li);
}

/**
 * Save tasks to localstorage.
 */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Load tasks from localstorage. If nothing is found for key "tasks",
 * return empty array.
 * @throws Error if contents in localstorage cannot be parsed as JSON
 * @returns {Array} Array of task objects or an empty.
 */
function loadTasks() {
  const storedTasksJson = localStorage.getItem("tasks");
  if (storedTasksJson != null) return JSON.parse(storedTasksJson);
  // Return empty list if nothing is stored for key 'tasks' in localstorage
  return [];
}

/**
 * Removes a task element from DOM and localstorage
 * @param {HTMLElement} taskElement
 */
function removeTask(taskElement) {
  const taskId = taskElement.id;
  // Filter (remove) items matching taskId from list tasks
  tasks = tasks.filter((task) => task.id != taskId);
  saveTasks();
  taskElement.remove();
}
/**
 * Toggles CSS class 'checked' for the input task element in DOM
 * and toggles the checked bool for the task in localstorage
 * @param {HTMLElement} taskElement
 */
function toggleChecked(taskElement) {
  // Find task in tasks array with corresponding id
  const task = tasks.find((task) => task.id == taskElement.id);
  // If task found in tasks
  if (task) {
    // Toggle value of checked for task and save change to localstorage
    task.checked = !task.checked; // (task points to the item in the array tasks who has
    //  the id == taskElement.id (see above).
    //  task.checked = !task.checked flips the boolean value
    //  for task.checked (true->false or false->true).
    //  Since the variable task is a reference to an item in
    //  the list tasks, the corresponding item will change.
    //  That means that this line will change a value in the tasks
    //  list, even if you dont se 'tasks' in this line of code.)
    saveTasks();
    // Toggle CSS class 'checked' for the task element in the DOM
    taskElement.classList.toggle("checked");
  }
}
/**
 * Finds highest number used as id for a task, and returns the next integer.
 * @returns {int} Unused task id
 */
function getNextTaskId() {
  // Return 0 if the list is empty
  if (tasks.length == 0) return 0;
  const maxId = Math.max(...tasks.map((task) => task.id)); 
  // (The Math.max() finds the max value in a list.
  //  tasks.map(task => task.id) returns a list of all
  //  the task ids in the tasks array. The ... is called spread,
  //  and basically 'unpacks' the array of tasks ids to pass them
  //  as individual parameters to the Math.max() function, instead
  //  of a single array.)
  return maxId + 1;
}
