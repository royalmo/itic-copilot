$(document).ready(function () {
    $(".aboutButton").click(function () {
        $("#landpageDiv").hide();
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


    $('input[type="checkbox"]').click(function () {
        if ($(this).attr("id") == "saveSVN") {
            $(".svnLog").toggle('swing');
        }
    });

    $(".tableLinksTr").click(function() {
        window.open($(this).data("href"));
    });
});
