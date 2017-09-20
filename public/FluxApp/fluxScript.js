password = sessionStorage.getItem("key")

if (password != "mkoffice") {
	window.open(window.open("index.html", "_self" ))
}

username = "holder"
password = "holder"

function logout(){
	window.open("../index.html", "_self")

}

function openPhoto(){
    window.open("../Photo/index.html", "_self")
}

function openTableau(){
    window.open("../tableau2.html", "_self")
}