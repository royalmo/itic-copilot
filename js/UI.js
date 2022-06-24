
document.getElementById("settingButton").addEventListener("click", displaySettings);
document.getElementById("aboutButton").addEventListener("click", displayAbout);
document.getElementById("backButton").addEventListener("click", closeWin);

function hello_world(){
    console.log("Hello World!");
}

function displaySettings() {
    console.log("Pop-Up");
    document.getElementById("iframeDisplay").innerHTML = "<iframe src=\"../html/settings.html\"></iframe>";

}

function displayAbout() {
    console.log("Pop-Up");
    document.getElementById("iframeDisplay").innerHTML = "<iframe src=\"../html/about.html\"></iframe>";

}

function closeWin() {
    console.log("Close Pop-Up");
    //var someIframe = window.parent.document.getElementById("iframeDisplay");
    //someIframe.parentNode.removeChild(someIframe);
    $('iframeDisplay').remove();
}