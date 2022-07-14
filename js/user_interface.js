$(document).ready(function () {
    $(".aboutButton").click(function () {
        $("#aboutDiv").show(
            function(){
                $('#aboutDiv').animate({
                    top: "-100",
                    backgroundColor: "bdd5f1"
                }, 500);
            },
            function(){
                $('#aboutDiv').animate({
                    top: "0",
                    backgroundColor: "F4F4F4"
                }, 500);
            }
        );
        $("#landpageDiv").hide();
    });
    $(".settingButton").click(function () {
        $("#settingDiv").show(
            function(){
                $('#settingDiv').animate({
                    top: "-100",
                    backgroundColor: "bdd5f1"
                }, 500);
            },
            function(){
                $('#settingDiv').animate({
                    top: "0",
                    backgroundColor: "F4F4F4"
                }, 500);
            }
        );
        $("#landpageDiv").hide();
    });
    $(".arrow").click(function () {

        if ($("#settingDiv").is(":visible")) {
            $("#settingDiv").hide(
                function(){
                    $('#settingDiv').animate({
                        top: "0%",
                        backgroundColor: "F4F4F4"
                    }, 500);
                },
                function(){
                    $('#settingDiv').animate({
                        top: "-100%",
                        backgroundColor: "bdd5f1"
                    }, 500);
                }
            );
        } else {
            $("#aboutDiv").hide(
                function(){
                    $('#aboutDiv').animate({
                        top: "0%",
                        backgroundColor: "F4F4F4"
                    }, 500);
                },
                function(){
                    $('#aboutDiv').animate({
                        top: "-100%",
                        backgroundColor: "bdd5f1"
                    }, 500);
                }
            );    
        }

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

