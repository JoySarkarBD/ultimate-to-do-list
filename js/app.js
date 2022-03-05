// elements getting function
function getId(id) {
  return document.getElementById(id);
}

// get elements by id
const form = getId("form");
const date = getId("date");
const tableData = getId("tableBody");
const searchTask = getId("task_name");
const filter = getId("filter");
const sort = getId("sort");
const byDate = getId("byDate");
const today = new Date().toISOString().slice(0, 10);
date.value = today;

// filtering functionality

// filter by search
searchTask.addEventListener("input", function (e) {
  tableData.innerHTML = "";
  filter.selectedIndex = 0;
  sort.selectedIndex = 0;
  byDate.value="";
  const searchTaskName = e.target.value;
  const data = getDataFromLocalStorage();
  let index = 0;
  data.forEach((task) => {
    if (task.name.toLowerCase().includes(searchTaskName.toLowerCase())) {
      index++;
      displayData(task, index);
    }
  });
});

// filter by filterOption
filter.addEventListener("change", function (e) {
  searchTask.value = "";
  tableData.innerHTML = "";
  sort.selectedIndex = 0;
  byDate.value="";
  const filterTerm = e.target.value;
  const data = getDataFromLocalStorage();
  let taskIndex = 0;
  if (filterTerm === "all") {
    data.forEach((task, index) => {
      displayData(task, index + 1);
    });
  } else if (filterTerm === "complete") {
    data.forEach((task) => {
      if (task.status === "complete") {
        taskIndex++;
        displayData(task, taskIndex);
      }
    });
  } else if (filterTerm === "incomplete") {
    data.forEach((task) => {
      if (task.status === "incomplete") {
        taskIndex++;
        displayData(task, taskIndex);
      }
    });
  } else if (filterTerm === "today") {
    data.forEach((task) => {
      if (task.date === today) {
        taskIndex++;
        displayData(task, taskIndex);
      }
    });
  } else if (filterTerm === "high") {
    data.forEach((task) => {
      if (task.priority === "high") {
        taskIndex++;
        displayData(task, taskIndex);
      }
    });
  } else if (filterTerm === "medium") {
    data.forEach((task) => {
      if (task.priority === "medium") {
        taskIndex++;
        displayData(task, taskIndex);
      }
    });
  } else if (filterTerm === "low") {
    data.forEach((task) => {
      if (task.priority === "low") {
        taskIndex++;
        displayData(task, taskIndex);
      }
    });
  }
});

// filter by sortOption
sort.addEventListener("change", function (e) {
  const sortTerm = e.target.value;
  searchTask.value = "";
  tableData.innerHTML = "";
  filter.selectedIndex = 0;
  byDate.value="";
  const data = getDataFromLocalStorage();
  if (sortTerm === "newest") {
    data.sort((firstData, secondData) => {
      if (new Date(firstData.date) < new Date(secondData.date)) {
        return 1;
      } else if (new Date(firstData.date) > new Date(secondData.date)) {
        return -1;
      } else {
        return 0;
      }
    });
  } else {
    data.sort((firstData, secondData) => {
      if (new Date(firstData.date) > new Date(secondData.date)) {
        return 1;
      } else if (new Date(firstData.date) < new Date(secondData.date)) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  data.forEach((task, index) => {
    displayData(task, index + 1);
  });
});

byDate.addEventListener("change", function (e) {
  const selectedDate = e.target.value;
  searchTask.value = "";
  tableData.innerHTML = "";
  filter.selectedIndex = 0;
  sort.selectedIndex = 0;
  const data = getDataFromLocalStorage();
  if(selectedDate){
    data.forEach((task, index) => {
      if (selectedDate === task.date) {
        displayData(task, index + 1);
      }
    });
  }else{
    data.forEach((task, index) => {
        displayData(task, index + 1);
    });
  }
});

// event of task adding section
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = [...this.elements];
  const inputData = {};
  let isValid = true;
  inputs.forEach((data) => {
    if (data.type !== "submit") {
      if (data.value == "") {
        alert("You can't add empty data.");
        isValid = false;
        return;
      }
      inputData[data.name] = data.value;
    }
  });
  if (isValid) {
    inputData.status = "incomplete";
    inputData.id = uuidv4();
    const data = getDataFromLocalStorage();
    displayData(inputData, data.length + 1);
    data.push(inputData);
    setDataToLocalStorage(data);
  }
  this.reset();
});

window.onload = reloadData;

function reloadData() {
  tableData.innerHTML = "";
  const data = getDataFromLocalStorage();
  data.forEach((task, index) => {
    displayData(task, index + 1);
  });
}

function displayData({ name, priority, date, status, id }, index) {
  const tr = document.createElement("tr");
  tr.dataset.id = id;
  tr.innerHTML = `
    <td id="no">${index}</td>
    <td id="name">${name}</td>
    <td id="priority">${priority}</td>
    <td id="status">${status}</td>
    <td id="date">${date}</td>
    <td id="actions">
    <button id="edit"><i class="fas fa-pen-fancy"></i></button>
    <button id="check"><i class="fas fa-check"></i></button>
    <button id="delete"><i class="fas fa-trash"></i></button>
    </td>`;
  tableData.appendChild(tr);
}

// get data from localStorage
function getDataFromLocalStorage() {
  let tasks = [];
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
  }
  return tasks;
}

// set data to localStorage
function setDataToLocalStorage(data) {
  localStorage.setItem("tasks", JSON.stringify(data));
}

// actions to delete,edit and status
tableData.addEventListener("click", function (e) {
  if (e.target.id == "edit") {
    const tasks = e.target.parentElement.parentElement;
    const taskId = tasks.dataset.id;
    const taskChild = tasks.children;

    // name of task
    let taskName;
    let input;
    // task priority
    let taskPriority;
    let select;
    // task date
    let taskDate;
    let date;
    // action buttons
    let actionButton;

    [...taskChild].forEach((taskChildData) => {
      if (taskChildData.id === "name") {
        taskName = taskChildData;
        const previousName = taskChildData.textContent;
        taskChildData.innerHTML = "";
        input = document.createElement("input");
        input.type = "text";
        input.value = previousName;
        taskChildData.appendChild(input);
      } else if (taskChildData.id === "priority") {
        taskPriority = taskChildData;
        const previousPriority = taskChildData.textContent;
        taskChildData.innerHTML = "";
        select = document.createElement("select");
        select.innerHTML = `<option disabled>Select one</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>`;
        if (previousPriority === "high") {
          select.selectedIndex = 1;
        } else if (previousPriority === "medium") {
          select.selectedIndex = 2;
        } else if (previousPriority === "low") {
          select.selectedIndex = 3;
        }
        taskChildData.appendChild(select);
      } else if (taskChildData.id === "date") {
        taskDate = taskChildData;
        const previousDate = taskChildData.textContent;
        taskChildData.innerHTML = "";
        date = document.createElement("input");
        date.type = "date";
        date.value = previousDate;
        taskChildData.appendChild(date);
      } else if (taskChildData.id === "actions") {
        actionButton = taskChildData;
        let previousButton = taskChildData.innerHTML;
        taskChildData.innerHTML = "";
        const saveButton = document.createElement("button");
        saveButton.innerHTML = `<i class="fas fa-save"></i>`;
        saveButton.addEventListener("click", function () {
          // new name of task
          const newTaskName = input.value;
          taskName.innerHTML = newTaskName;

          // new task priority
          const newPriority = select.value;
          taskPriority.innerHTML = newPriority;

          //new date of task
          const newDate = date.value;
          taskDate.innerHTML = newDate;

          // actions buttons
          actionButton.innerHTML = previousButton;

          // save data to localStorage
          let data = getDataFromLocalStorage();
          data = data.filter((task) => {
            if (task.id === taskId) {
              task.name = newTaskName;
              task.priority = newPriority;
              task.date = newDate;
              return task;
            } else {
              return task;
            }
          });
          setDataToLocalStorage(data);
        });
        taskChildData.appendChild(saveButton);
      }
    });
  } else if (e.target.id == "check") {
    const tasks = e.target.parentElement.parentElement;
    const taskId = tasks.dataset.id;
    const taskChild = tasks.children;
    [...taskChild].forEach((taskChildData) => {
      if (taskChildData.id === "status") {
        let data = getDataFromLocalStorage();
        data = data.filter((task) => {
          if (task.id === taskId) {
            // return task;
            if (task.status == "incomplete") {
              task.status = "complete";
              taskChildData.innerHTML = "complete";
            } else {
              task.status = "incomplete";
              taskChildData.innerHTML = "incomplete";
            }
            return task;
          } else {
            return task;
          }
        });
        setDataToLocalStorage(data);
      }
    });
  } else if (e.target.id == "delete") {
    const task = e.target.parentElement.parentElement;
    const taskId = task.dataset.id;
    task.remove();
    let data = getDataFromLocalStorage();
    data = data.filter((task) => {
      if (task.id !== taskId) {
        return task;
      }
    });
    setDataToLocalStorage(data);
    reloadData();
  }
});
