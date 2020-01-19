//control panel buttons
addFoodBtn.onclick = function() {

	if (hidden) {
		var controlPanel = document.getElementById("controlPanel");
		controlPanel.style.display = "block";
		hidden = false;
	}
	currentId = "";
	addFoodText.value = "";

    var re = new RegExp("savedMap" + "=([^;]+)");
    var value = re.exec(document.cookie);
    var mapSaved = JSON.parse(value[1]);
    
    for(var id in mapSaved) {
      var item = document.createElement("a");
      item.id = id+"-item";
      item.className = "item";
      item.draggable = "true";
      var text = document.createTextNode(mapSaved[id].name);
      console.log(text);
      
      
      item.appendChild(text);
      item.onclick = function() {
        controlPanel.style.display = "block";
        hidden = false;
        addFoodText.value = this.textContent;
      }
      
      item.ondragstart = function() {
      	    var r = confirm("ELIMARE "+id);
            if (!r) {
              return;
            }
            
            this.remove();
            
      }
      dropdown.appendChild(item);
    }


}

confirmBtn.onclick = function() {

	var addFoodText = document.getElementById("addFoodText");
	var name = addFoodText.value;
	if ( name !== "" ) {
		if(currentId === "") {
			//assign a new id
			var id = "product"+timerMap.size.toString();
			//create new timer
			var timer = new Timer(id, name, 60);
			timer.create(id);
			//add to the map of timers
			timerMap.set(id, timer);
            
            //get saved map into cookie
            var re = new RegExp("savedMap" + "=([^;]+)");
    		var value = re.exec(document.cookie);
    		var mapSaved = JSON.parse(value[1]);
            console.log(mapSaved);
            if( !(name in mapSaved) ) {
            	//update only if it's totally new
            	mapSaved[name] = timer;
                var mapSavedStr = JSON.stringify(mapSaved);
                document.cookie = "savedMap="+mapSavedStr;
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
        
        //update timerMap into cookie
      	var timerMapObj = {};
      	for (var [timer_index, timer] of timerMap ){
        	timerMapObj[timer_index] = timer;
      	}
      	var timerMapStr = JSON.stringify(timerMapObj);
      	document.cookie = "savedMap="+timerMapStr;
      	console.log(document.cookie);

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
	
    if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(4);	
	}

}

subBtn.ondblclick = function() {

	if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(-4);	
	}

}

addBtn.addEventListener("touchstart", addTapHandler);
function addTapHandler(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 220 );
        return false;
    }
    event.preventDefault();
    if( currentId !== "") {
		var timer = timerMap.get(currentId);
		timer.setup(4);
	}
 }


subBtn.addEventListener("touchstart", subTapHandler);
function subTapHandler(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 220 );
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

    var r = confirm("Vuoi caricare tutta la i dati salvati?");
    if (r == false) {
      return;
    }
    
	console.log(document.cookie);

    
}



searchBtn.onclick =  function() {
    dropdown.classList.toggle("show");
}

searchInput.onkeyup = function() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!event.target.matches('.dropmenu')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");

    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


searchBtn.onclick =  function() {
    dropdown.classList.toggle("show");
}

searchInput.onkeyup = function() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!event.target.matches('.dropmenu')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");

    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


window.onbeforeunload = function() {
    return false;
}

function timerMapCallback() {
	console.log("timers");
	console.log(timerMap);
	console.log("active timers");
	console.log(activeTimerMap);
	console.log("current id: "+currentId);
	for (var [timer_index, timer] of activeTimerMap ){

		if (timer.remainingSeconds > 0) {
			timer.remainingSeconds = timer.remainingSeconds - 1;
		} else {
			activeTimerMap.delete(timer.id);         
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