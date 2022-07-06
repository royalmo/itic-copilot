$(document).ready(function () {
    $(".aboutButton").click(function () {
        console.log("SHOW ABOUT");
        $("#settingDiv").hide();
        $("#aboutDiv").show();
        $("#landpageDiv").hide();
    });
    $(".settingButton").click(function () {
        console.log("SHOW SETTINGS");
        $("#settingDiv").show();
        $("#aboutDiv").hide();
        $("#landpageDiv").hide();
    });
    $(".langpageButton").click(function () {
        console.log("SHOW LANDPAGE");
        $("#settingDiv").hide();
        $("#aboutDiv").hide();
        $("#landpageDiv").show();
    });

});

$(document).ready(function () {

    $('input[type="checkbox"]').click(function () {
        if ($(this).attr("id") == "saveSVN") {
            $(".svnLog").toggle('swing');
        }
    });
});


function hello_world() {
    console.log("Hello World!");
}

