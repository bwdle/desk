// config
var minBreakLength = 1,
    maxBreakLength = 30,
    minSessionLength = 1,
    maxSessionLength = 100,
    defaultBreakLength = 25,
    defaultSessionLength = 65,
    sessionMessage = 'Get to work, you lousy bum',
    breakMessage = 'Take it easy',
    pauseMessage = 'Paused';
    
// initialize timers
var sessionLength = defaultSessionLength,
    breakLength = defaultBreakLength;

// initialize global time interval
var countdown, timer = { minutes: 0, seconds: 0, paused: false, running: false, type: 'session' };

// function to update break/session durations
// need to pass the id to update
function updateCounter (type, duration) {
  $('#' + type).html(duration);
  if (countdown) clearInterval(countdown);
  timer.running = false;
  timer.paused = false;
  timer.type = 'session';
  $('.message').html('');
  updateTimeDisplay();
}

// update the time display whenever any of the lengths change
function updateTimeDisplay () {
  $('.time').html((sessionLength.toString().length < 2 ? '0' + sessionLength : sessionLength) + ':00');
}

// update the timer message depending on whether it's work time vs break time
function updateMessage (type) {
  $('.message').html(type == 'session' ? sessionMessage : breakMessage);
}

updateCounter('break', breakLength);
updateCounter('session', sessionLength);

// functionality to adjust break/session lengths
// can't go above/below max/min set in config
$("#breakUp").click(function () {
  if (breakLength < maxBreakLength)
    updateCounter('break', ++breakLength);
});
$("#breakDown").click(function () {
  if (breakLength > minBreakLength)
    updateCounter('break', --breakLength);
});
$("#sessionUp").click(function () {
  if (sessionLength < maxSessionLength)
    updateCounter('session', ++sessionLength);
});
$("#sessionDown").click(function () {
  if (sessionLength > minSessionLength)
    updateCounter('session', --sessionLength);
});

function updateTimer () {
  if (timer.seconds == 0) {
    timer.minutes--;
    timer.seconds = 59;
  } else
    timer.seconds--;

  if (timer.minutes < 0) {
    clearInterval(countdown);
    switchTimers();
  }

  $('.time').html((timer.minutes.toString().length == 1 ? '0' + timer.minutes : timer.minutes) + ':' + (timer.seconds.toString().length == 1 ? '0' + timer.seconds : timer.seconds))
}

function startTimer (duration) {
  if (!timer.running) {
    timer.minutes = duration;
    timer.seconds = 0;
    updateMessage(timer.type);
  }
  
  timer.running = true;
  
  countdown = setInterval(updateTimer, 1000);
}

function switchTimers () {
  timer.running = false;
  timer.type = timer.type == 'session' ? 'break' : 'session';
  startTimer(
    timer.type == 'session' ? sessionLength : breakLength
  );
}

$('.countdown').click(function () {
  if (timer.paused) {
    timer.paused = false;
    countdown = setInterval(updateTimer, 1000);
  } else if (!timer.paused && timer.running) {
    timer.paused = true;
    if (countdown) clearInterval(countdown);
  } else {
    startTimer(sessionLength);
  }
});





var taskInput = document.getElementById("new-task"); //new-task
var addButton = document.getElementsByTagName("button")[0]; //first button
var incompleteTasksHolder = document.getElementById("incomplete-tasks"); //incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks"); //completed-tasks

//New Task List Item
var createNewTaskElement = function(taskString) {
	//Create List Item
	var listItem = document.createElement("li");

	//input (checkbox)
	var checkBox = document.createElement("input"); // checkbox
	//label
	var label = document.createElement("label");
	//input (text)
	var editInput = document.createElement("input"); // text
	//button.edit
	var editButton = document.createElement("button");
	//button.delete
	var deleteButton = document.createElement("button");

	//Each element needs modifying

	checkBox.type = "checkbox";
	editInput.type = "text";

	editButton.innerText = "Edit";
	editButton.className = "edit";
	deleteButton.innerText = "Delete";
	deleteButton.className = "delete";

	label.innerText = taskString;

	//Each element needs appending
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);

	return listItem;
}

//Add a new task
var addTask = function() {
	console.log("Add task...");
	//Create a new list item with the text from #new-task:
	var listItem = createNewTaskElement(taskInput.value);
	//Append listItem to incompleteTasksHolder
	incompleteTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);

	taskInput.value = "";
}

//Edit an existing task
var editTask = function() {
	console.log("Edit task...");

	var listItem = this.parentNode;

	var editInput = listItem.querySelector("input[type=text");
	var label = listItem.querySelector("label");

	var containsClass = listItem.classList.contains("editMode");

	//if the class of the parent is .editMode
	if (containsClass) {
		//Switch from .editMode
		//label text become the input's value
		label.innerText = editInput.value;
	} else {
		//Switch to .editMode
		//input value becomes the label's text
		editInput.value = label.innerText;
	}

	//Toggle .editMode on the list item
	listItem.classList.toggle("editMode");

}

//Delete an existing task
var deleteTask = function() {
	console.log("Delete task...");
	var listItem = this.parentNode;
	var ul = listItem.parentNode;

	//Remove the parent list item from the ul
	ul.removeChild(listItem);
}

//Mark a task as complete
var taskCompleted = function() {
	console.log("Task complete...");
	//Append the task list item to the #completed-tasks
	var listItem = this.parentNode;
	completedTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskIncomplete);
}

//Mark a task as incomplete
var taskIncomplete = function() {
	console.log("Task incomplete...");
	//Append the task list item to the #incomplete-tasks
	var listItem = this.parentNode;
	incompleteTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
	console.log("Bind list item events");
	//select taskListItem's children
	var checkBox = taskListItem.querySelector("input[type=checkbox]");
	var editButton = taskListItem.querySelector("button.edit");
	var deleteButton = taskListItem.querySelector("button.delete");

	//bind editTask to edit button
	editButton.onclick = editTask;

	//bind deleteTask to delete button
	deleteButton.onclick = deleteTask;

	//bind checkBoxEventHandler to checkbox
	checkBox.onchange = checkBoxEventHandler;
}

// var ajaxRequest = function() {
// 	console.log("AJAX request");
// }

//Set the click handler to the addTask function
addButton.addEventListener("click", addTask);
//addButton.addEventListener("click", ajaxRequest);

//cycle over incompleteTasksHolder ul list items
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
	//bind events to list item's children (taskCompleted)
	bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

//cycle over completedTasksHolder ul list items
for (var i = 0; i < completedTasksHolder.children.length; i++) {
	//bind events to list item's children (taskIncomplete)
	bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}



const displayTime = document.querySelector(".display-time");
// Time
function showTime() {
  let time = new Date();
  displayTime.innerText = time.toLocaleTimeString("en-US", { hour12: false });
  setTimeout(showTime, 1000);
}

showTime();

// Date
function updateDate() {
  let today = new Date();

  // return number
  let dayName = today.getDay(),
    dayNum = today.getDate(),
    month = today.getMonth(),
    year = today.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // value -> ID of the html element
  const IDCollection = ["day", "daynum", "month", "year"];
  // return value array with number as a index
  const val = [dayWeek[dayName], dayNum, months[month], year];
  for (let i = 0; i < IDCollection.length; i++) {
    document.getElementById(IDCollection[i]).firstChild.nodeValue = val[i];
  }
}

updateDate();

