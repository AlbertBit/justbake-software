//global variables and parameters
var addFoodBtn = document.getElementById("addFoodBtn");
var addFoodText = document.getElementById("addFoodText");
var foodList = document.getElementById("foodList");
var resetAllBtn = document.getElementById("resetAllBtn");
var timerMap = new Map();
var activeTimerMap = new Map();

//timer class
function Timer (id, deltaSeconds) {
	this.id = id;
    this.remainingSeconds = 0;
	this.htmlObject = null;
    this.deltaSeconds = deltaSeconds;
}

//create timer oject in the code
Timer.prototype.create = function() {

	var foodSpan = document.createElement("span");
	foodSpan.className = "form-control-static foodSpan";
	var foodSpanNode = document.createTextNode(addFoodText.value);
	foodSpan.appendChild(foodSpanNode)

	var timeSpan = document.createElement("span");
	timeSpan.className = "form-control-static timeSpan";
		
	var addDelta = document.createElement("button");
	var addDeltaText = document.createTextNode("+");
	addDelta.className = "btn btn-primary addBtn";
	addDelta.appendChild(addDeltaText);
	addDelta.onclick = function() {

		var timer = timerMap.get(this.parentNode.id);
		timer.setup(1);
		console.log(timer);
	}
	
	var subDelta = document.createElement("button");
	var subDeltaText = document.createTextNode("-");
	subDelta.className = "btn btn-primary subBtn";		
	subDelta.appendChild(subDeltaText);
	subDelta.onclick = function() {
		var timer = timerMap.get(this.parentNode.id);
		timer.setup(-1);
		console.log(timer);
	}

	//TODO
	//var addsubDelta = document.createElement("span");
	//addsubDelta.style.display = "inline-block";
	///addsubDelta.appendChild(addDelta);
	//addsubDelta.appendChild(subDelta);

	var startTimer = document.createElement("button");
	var startTimerText = document.createTextNode("Start");
	startTimer.className = "btn btn-success startBtn";
	startTimer.appendChild(startTimerText);

	startTimer.onclick = function() {
		var timer = timerMap.get(this.parentNode.id);
		timer.start();
		console.log(timer);
	}

	var stopTimer = document.createElement("button");
	var stopTimerText = document.createTextNode("Stop");
	stopTimer.className = "btn btn-secondary stopBtn";
	stopTimer.appendChild(stopTimerText);
	stopTimer.onclick = function() {
		var timer = timerMap.get(this.parentNode.id);
		timer.stop();
		console.log(timer);
	}

	var resetTimer = document.createElement("button");
	var resetTimerSpan = document.createElement("span");
	resetTimer.className = "btn btn-warning resetBtn";
	resetTimerSpan.className = "glyphicon glyphicon-repeat";
	resetTimer.appendChild(resetTimerSpan);
	resetTimer.onclick = function() {
		var timer = timerMap.get(this.parentNode.id);
		timer.reset();
		console.log(timer);
	}

	var deleteTimer = document.createElement("button");
	var deleteTimerSpan = document.createElement("span");
	deleteTimer.className = "btn btn-danger deleteBtn";
	deleteTimerSpan.className = "glyphicon glyphicon-trash";
	deleteTimer.appendChild(deleteTimerSpan);
	deleteTimer.onclick = function() {
		var timer = timerMap.get(this.parentNode.id);
		console.log(timer);
		timer.delete();
		//remove from DOM
		this.parentNode.remove();
	}

	// var addPreference = document.createElement("button");
	// var addPreferenceText = document.createTextNode("P");
	// addPreference.className = "prefBtn";
	// addPreference.appendChild(addPreferenceText);
	// addPreference.onclick = function() {
	// 	//ADD TO PREFERENCE
	// }

	var foodDiv = document.createElement("div");
	foodDiv.id = addFoodText.value;
	foodDiv.className = "foodItem";
	foodDiv.appendChild(foodSpan);
	foodDiv.appendChild(timeSpan);
	foodDiv.appendChild(subDelta);
	foodDiv.appendChild(addDelta);
	foodDiv.appendChild(startTimer);
	foodDiv.appendChild(stopTimer);
	foodDiv.appendChild(resetTimer);
	foodDiv.appendChild(deleteTimer);

	
	//foodDiv.appendChild(addPreference);

	foodList.appendChild(foodDiv);	

	this.htmlObject = foodDiv;
	console.log("Object created");
}

Timer.prototype.setup = function( sign ) {

	//safety-policy that may be adopted:
	//allow the timer to be setup only when it's stopped
	//if( activeTimerMap.has(this.id) )
	//	return;

	this.remainingSeconds = this.remainingSeconds + sign*this.deltaSeconds;
	if (this.remainingSeconds < 0) {
		this.stop();
		this.remainingSeconds = 0;
	}
	this.show();
}
 
Timer.prototype.start = function() {
	if (this.remainingSeconds > 0) {
		activeTimerMap.set(this.id, this);
	}
}

Timer.prototype.stop = function() {
    activeTimerMap.delete(this.id);
}

Timer.prototype.reset = function() {
    this.stop();
    this.remainingSeconds = 0;
    this.show();
}

Timer.prototype.delete = function() {
    this.stop();
    timerMap.delete(this.id);
}


Timer.prototype.show = function() {

	min = Math.floor(this.remainingSeconds / 60);
	sec = Math.floor(this.remainingSeconds % 60);
	var str = min + "m " +  sec + "s ";
	var timerBox = document.getElementById(this.id);

	timerBox.childNodes[1].innerHTML = str;
	if( this.remainingSeconds <= 299) {
		timerBox.childNodes[1].style.color = "red";
	} else {
		timerBox.childNodes[1].style.color = "black";
	}
}


//update all active timers
//good if the number of timers is not very large
//otherwise some overhead is added
//better to have a separate thread for each timer
//but that's ok for our application
function timerMapCallback() {
	console.log("timers");
	console.log(timerMap);
	console.log("active timers");
	console.log(activeTimerMap);
	for (var [timer_index, timer] of activeTimerMap ){

		if (timer.remainingSeconds > 0) {
			timer.remainingSeconds = timer.remainingSeconds - 1;
			timer.show();
		} else {
			activeTimerMap.delete(timer.id);
		}
		
	}
}

function timing(callback) {
	setInterval(callback, 1000);
}
//start timer to update active timers
window.onload = function() {
	timing(timerMapCallback);

}

resetAllBtn.onclick = function() {
	for (var [timer_index, timer] of timerMap ){
		timer.reset();
	}
	for (var [timer_index, timer] of activeTimerMap ){
		timer.reset();
	}
}

//create new time object
addFoodBtn.onclick = function() {

	id = addFoodText.value
	if(!timerMap.has(id) && id !== "") {
		var timer = new Timer(id, 60);
		timer.create();
		timer.show();
		timerMap.set(id, timer);

	}
	
}


window.onbeforeunload = function() {
	return false;
}