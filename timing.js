//global variables and parameters
var timerMap = new Map();
var activeTimerMap = new Map();

var addFoodBtn = document.getElementById("addFoodBtn");
var foodList = document.getElementById("foodList");
var hidden = true;
var tapedTwice = false;
var currentId = "";


//buttons of control panel
var confirmBtn = document.getElementById("confirmBtn");
var deleteBtn = document.getElementById("deleteBtn");
var addBtn = document.getElementById("addBtn");
var subBtn = document.getElementById("subBtn");
var startBtn = document.getElementById("startBtn");
var stopBtn = document.getElementById("stopBtn");

var logoBtn = document.getElementById("logo");


//timer class
function Timer (id, name, deltaSeconds) {
	this.id = id;
	this.name = name;
    this.remainingSeconds = 0;
    this.deltaSeconds = deltaSeconds;
}

//create timer oject in the code
Timer.prototype.create = function(id) {

	var foodSpan = document.createElement("span");
	foodSpan.className = "form-control-static foodSpan";

	var foodSpanTextNode = document.createTextNode(addFoodText.value);
	foodSpan.appendChild(foodSpanTextNode)

	var timeSpan = document.createElement("span");
	timeSpan.className = "form-control-static timeSpan";

	var foodDiv = document.createElement("div");
	foodDiv.id = id;
	foodDiv.className = "foodItem";
	foodDiv.appendChild(foodSpan);
	foodDiv.appendChild(timeSpan);
	foodList.appendChild(foodDiv);	

	foodSpan.onclick = function() {
		
		var controlPanel = document.getElementById("controlPanel");
		controlPanel.style.display = "block";
		hidden = false;
		var parentNodeId = this.parentNode.id;						
		var timer = timerMap.get(parentNodeId);
		var name = timer.name;

		var addFoodText = document.getElementById("addFoodText");
		addFoodText.value = name;

		currentId = parentNodeId;

	}
	this.show();

}

Timer.prototype.setup = function( factor ) {

	console.log("timer "+factor+" "+this.name);

	this.remainingSeconds = this.remainingSeconds + factor*this.deltaSeconds;
	console.log()
	if (this.remainingSeconds < 0) {
		this.stop();
		this.remainingSeconds = 0;
	}
	this.show();
}
 
Timer.prototype.start = function() {

	console.log("timer started "+this.name);
	if (this.remainingSeconds > 0) {
		activeTimerMap.set(this.id, this);
	}
}

Timer.prototype.stop = function() {

	console.log("timer stopped "+this.name);
    activeTimerMap.delete(this.id);
}

Timer.prototype.reset = function() {
    this.stop();
    this.remainingSeconds = 0;
    this.show();
}


Timer.prototype.show = function() {

	var min = Math.floor(this.remainingSeconds / 60);
	var sec = Math.floor(this.remainingSeconds % 60);
	var str = "";
	if(min>0) {
		str = min + " min";
	} else {
		str = sec + " sec";
	}


	var foodDiv = document.getElementById(this.id);
	var timeSpan = foodDiv.childNodes[1];
	var timeSpanTextNode = timeSpan.childNodes[0];
	timeSpan.textContent = str;
	timeSpan.style.color = "orange";
	if(activeTimerMap.has(this.id))  {
        if( this.remainingSeconds < 300) {
          timeSpan.style.color = "red";
        } else {
          timeSpan.style.color = "green";
        }
    }

}



//update all active timers
//good if the number of timers is not very large
//otherwise some overhead is added
//better to have a separate thread for each timer (FUTURE WORK)

//create new time object
addFoodBtn.onclick = function() {

	if (hidden) {
		var controlPanel = document.getElementById("controlPanel");
		controlPanel.style.display = "block";
		hidden = false;
	}
	currentId = "";
	addFoodText.value = "";


}

confirmBtn.onclick = function() {

	var addFoodText = document.getElementById("addFoodText");

	if ( addFoodText.value !== "" ) {
		if(currentId === "") {
			//assign a new id
			var ms = Date.now();
			var id = "product_"+ ms.toString();

			//create new timer
			var timer = new Timer(id, addFoodText.value, 60);
			timer.create(id);
			//add to the map of timers
			timerMap.set(id, timer);

    		var timerMapObj = {};
			for (var [timer_index, timer] of timerMap ){
				timerMapObj[timer_index] = timer;
			}

		} else {
			//modify timer
			var timer = timerMap.get(currentId);

			if (timer.name !== addFoodText.value) {
				timer.name = addFoodText.value;
				var foodDiv = document.getElementById(currentId);
				var foodSpan = foodDiv.childNodes[0];
				var foodSpanTextNode = foodSpan.childNodes[0];
				foodSpan.textContent = addFoodText.value;
			}
		}
	}


	if (!hidden) {
		var controlPanel = document.getElementById("controlPanel");
		controlPanel.style.display = "none";
		hidden = true;
	}
	currentId = "";
	addFoodText.value = "";
}

deleteBtn.onclick = function(){

	if (!hidden) {
		var controlPanel = document.getElementById("controlPanel");
		controlPanel.style.display = "none";
		hidden = true;
	}

	if (currentId !== "") {
		var check = timerMap.delete(currentId);
		
		//remove from DOM
		document.getElementById(currentId).remove();
		currentId = "";
		addFoodText.value = "";

	}

}


addBtn.onclick = function() {

	if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(1);	
	}

}

subBtn.onclick = function() {

	if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(-1);	
	}

}

addBtn.ondblclick = function() {
	console.log("dbl click -");
	if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(4);	
	}

}

subBtn.ondblclick = function() {

	console.log("dbl click -");
	if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(-4);	
	}

}

addBtn.addEventListener("touchstart", addTapHandler);
function addTapHandler(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 300 );
        return false;
    }
    event.preventDefault();
    //action on double tap goes below

    if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(4);
	}
 }


subBtn.addEventListener("touchstart", subTapHandler);
function subTapHandler(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 300 );
        return false;
    }
    event.preventDefault();

    if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(-4);	
	}
 }

startBtn.onclick = function() {

	if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.start();	
	}

}

stopBtn.onclick = function() {

	if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.stop();	
	}

}

logo.onclick = function() {
	console.log(document.cookie);
}

window.onbeforeunload = function() {
    return false;
}

//but that's ok for our application
function timerMapCallback() {
	console.log("timers");
	console.log(timerMap);
	console.log("active timers");
	console.log(activeTimerMap);
	console.log("current id: "+currentId);
	for (var [timer_index, timer] of timerMap ){

		if(activeTimerMap.has(timer_index)) {
			if (timer.remainingSeconds > 0) {
				timer.remainingSeconds = timer.remainingSeconds - 1;
			} else {
				activeTimerMap.delete(timer.id);         
			}
		}
		timer.show();

	}
}

function timing(callback) {
	setInterval(callback, 1000);
}
//start timer to update active timers
window.onload = function() {
	timing(timerMapCallback);
}
