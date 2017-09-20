password = sessionStorage.getItem("key")
username = sessionStorage.getItem("key2")
console.log(username)

// Add an additional else if clause to the if statement and add new user's credentials below 
if (password == "mkoffice" && username == "user") {
	console.log("Previous User Log In")
} else if (password == "manoa" && username == "jkurata") {
    console.log("Previous J Kurata Log In")
} else if (password == "manoa" && username == "jgouveia"){
    console.log("Previous J Gouveia Log In")
} else {
    window.open(window.open("index.html", "_self" ))
}

// After log in reset to default to ensure some security
username = "holder"
password = "holder"

// Log out function to take you to log in page
function logout(){
	window.open("index.html", "_self")
}

// Tab Function
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openHome() {
    window.open("home.html", "_self")
}

function openRH1() {
    window.open("http://www.roundhouseone.com/", "_self")
}

function openPhoto(){
    window.open("Photo/index.html", "_self")
}

function openFlux(){
    window.open("FluxApp/index.html", "_self")
}

function openTableau(){
    window.open("tableau2.html", "_self")
}

// Visualization Functions

var where = 0;

// Initial Visualization to show Inventory Dashboard
function initialViz() {
var placeholderDiv = document.getElementById("holder1");
// var url = "https://public.tableau.com/views/UHManoaFacilitiesInventoryAnalysis/Inventory";
var url = "https://public.tableau.com/views/FacilitiesInventoryAnalysis/Inventory"
var options = {
    width: window.innerWidth - 15,
    // height: window.innerHeight,
    height: 1150,
    hideTabs: true,
    hideToolbar: false,
    onFirstInteractive: function () {
        workbook = viz.getWorkbook();
        activeSheet = workbook.getActiveSheet();
        console.log("API Connecting")}
    };
    
viz = new tableau.Viz(placeholderDiv, url, options);

where = 1
document.getElementById("department").style.background = "#ccc" 
document.getElementById("inventory").style.background = "#8e8e8e"
document.getElementById("instruction").style.background = "#ccc"

};

// Function to open Department Visualization
function departmentViz() {
viz.dispose()
var placeholderDiv = document.getElementById("holder1");
// var url = "https://public.tableau.com/views/UHManoaDepartmentalSpaceAnalysis/Department";
var url = "https://public.tableau.com/views/DepartmentalSpaceAnalysis/Department"
var options = {
    width: window.innerWidth - 15,
    // height: window.innerHeight,
    height: 1150,
    hideTabs: true,
    hideToolbar: false,
    onFirstInteractive: function () {
        workbook = viz.getWorkbook();
        activeSheet = workbook.getActiveSheet();
        console.log("API Connecting")}
    };
    
viz = new tableau.Viz(placeholderDiv, url, options);

where = 2
document.getElementById("department").style.background = "#8e8e8e"
document.getElementById("inventory").style.background = "#ccc"
document.getElementById("instruction").style.background = "#ccc"

};

// Function to open Inventory Visualization
function inventoryViz() {
viz.dispose()
var placeholderDiv = document.getElementById("holder2");
// var url = "https://public.tableau.com/views/UHManoaFacilitiesInventoryAnalysis/Inventory";
var url = "https://public.tableau.com/views/FacilitiesInventoryAnalysis/Inventory"
var options = {
    width: window.innerWidth - 15,
    // height: window.innerHeight,
    height: 1150,
    hideTabs: true,
    hideToolbar: false,
    onFirstInteractive: function () {
        workbook = viz.getWorkbook();
        activeSheet = workbook.getActiveSheet();
        console.log("API Connecting")}
    };
    
viz = new tableau.Viz(placeholderDiv, url, options);

where = 1
document.getElementById("inventory").style.background = "#8e8e8e"
document.getElementById("department").style.background = "#ccc"
document.getElementById("instruction").style.background = "#ccc"
};

// Function to open Instruction Visualization
function instructionViz() {
viz.dispose()
var placeholderDiv = document.getElementById("holder3");
// var url = "https://public.tableau.com/views/UHManoaInstructionalSpaceAnalysis/Instruction";
var url = "https://public.tableau.com/views/InstructionalSpaceAnalysis/Instruction"
var options = {
    width: window.innerWidth - 15,
    // height: window.innerHeight,
    height: 1150,
    hideTabs: true,
    hideToolbar: false,
    onFirstInteractive: function () {
        workbook = viz.getWorkbook();
        activeSheet = workbook.getActiveSheet();
        console.log("API Connecting")}
    };
    
viz = new tableau.Viz(placeholderDiv, url, options);

where = 3
document.getElementById("instruction").style.background = "#8e8e8e"
document.getElementById("department").style.background = "#ccc"
document.getElementById("inventory").style.background = "#ccc"

};

// Rerun Functions if page is resized
function resize(x){
if(x == 1){
    departmentViz()
} else if (x == 2){
    inventoryViz()
} else if (x == 3){
    viz
  instructionViz()
};
};