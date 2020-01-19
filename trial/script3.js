/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

var dropdown = document.getElementById("myDropdown");
var searchBtn = document.getElementById("searchBtn");
var searchInput = document.getElementById("myInput");

searchBtn.onclick = function() {
    dropdown.classList.toggle("show");
}

searchInput.onkeyup = function() {
    var input = document.getElementById("myInput");
    var filter = input.value.toUpperCase();
    var div = document.getElementById("myDropdown");
    var a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}