$(document).ready(function(){
    $("#aboutButton").click(function(){
        console.log("SHOW ABOUT");   
        $("#settingDiv").hide();
        $("#aboutDiv").show();
        $("#landpageDiv").hide();
        });
    $("#settingButton").click(function(){
        console.log("SHOW SETTINGS");
        $("#settingDiv").show();
        $("#aboutDiv").hide();
        $("#landpageDiv").hide();
    });
    $("#langpageButton").click(function(){
        console.log("SHOW LANDPAGE");
        $("#settingDiv").hide();
        $("#aboutDiv").hide();
        $("#landpageDiv").show();
        });

   });


function hello_world(){
    console.log("Hello World!");
}

