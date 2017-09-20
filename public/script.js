
var button = document.getElementById("buttonID"),
username = "holder"
password = "holder"
button.onclick = function() {
    run(username, password);
}

// To add additional users add to the or clause in the if statement found in the run function. Be sure to add a username and a password
// Once added move to the script2.js docement and add credentials to the inital if statement
function run(username, password) {
	username =  button.form.userid.value;
	console.log(username)
	password = button.form.pswd.value;
	console.log(password)
	sessionStorage.setItem("key", password)
	sessionStorage.setItem("key2", username)
	if (username == "user" && password == "mkoffice" || username == "jkurata" && password == "manoa" || username == "jgouveia" && password == "manoa"){
		window.open("tableau2.html", "_self" )
	} else {
		window.alert("Incorrect Username and/or Password")
	}
}

// Function allowing return key to submit creditials on index.html
document.getElementById("pswd").onkeydown = function(e){
   if(e.keyCode == 13){
     run()
   }
};

username = "holder"
password = "holder"