const inputBox = document.getElementById("input-box");
const listcontainer = document.getElementById("list-container");
let tasks = loadTasks();

function addTask() {
  const newTaskName = inputBox.value;
  if (newTaskName === "") {
    alert("You must write something");
  } else if (tasks.findIndex((task) => task.name == newTaskName) > -1){
    alert("Task already exists!")
  } else {
    id = getNextTaskId();
    tasks.push({
      id: id,
      caption: newTaskName,
      checked: false,
    });
    saveTasks();
    populateHtmlList(newTaskName, id);
  }
  inputBox.value = "";
}

function populateHtmlList(taskName, id, checked = false) {
  let li = document.createElement("li");
  li.innerHTML = taskName;
  li.id = id;
  listcontainer.appendChild(li);
  let span = document.createElement("span");
  span.innerHTML = "\u00d7";
  li.appendChild(span);
  if (checked) {
    li.target.classList.add("checked");
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasksJson = localStorage.getItem("tasks");
  if (storedTasksJson != null) {
    const storedTasks = JSON.parse(storedTasksJson);
    if (Array.isArray(storedTasks)) {
      storedTasks.forEach((task) => {
        populateHtmlList(task.caption, task.id, task.checked);
      });
      return storedTasks;
    }
  }
  return [];
}

function removeTask(taskHtmlElement) {
  const taskId = taskHtmlElement.id;
  const taskIndex = tasks.findIndex((task) => task.id == taskId);
  tasks = tasks.splice(taskIndex, 1);
  saveTasks();
  taskHtmlElement.remove();
}

function toggleChecked(taskHtmlElement) {
  const taskId = taskHtmlElement.id;
  console.log(taskId);
  const taskIndex = tasks.findIndex((task) => task.id == taskId);
  const taskChecked = taskHtmlElement.classList.contains("checked");

  taskHtmlElement.classList.toggle("checked");
  tasks[taskIndex].checked = !taskChecked;
  saveTasks();
}

function getNextTaskId(){
  const usedIds = []
  tasks.forEach((task) => {
    usedIds.push(task.id);
  });
  tasks.sort((taskA, taskB) => taskA.id - taskB.id);
  let id = 0;
  tasks.forEach((task) => {
    if (id != task.id)
      return id;
    id++;
  });
  return id;
}

listcontainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      toggleChecked(e.target);
    } else if (e.target.tagName === "SPAN") {
      removeTask(e.target.parentElement);
    }
  },
  false
);
