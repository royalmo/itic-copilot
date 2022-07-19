$(document).ready(function () {
    $("#aboutDiv").hide(
        function(){
            $('#aboutDiv').animate({
                top: "0%",
                backgroundColor: "bdd5f1"
            }, 500);
        },
        function(){
            $('#aboutDiv').animate({
                top: "-100%",
                backgroundColor: "F4F4F4"
            }, 500);
        }
    );

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

    $(".settingButton").click(function () {
        $("#settingDiv").show(
            function(){
                $('#settingDiv').animate({
                    top: "-100%",
                    backgroundColor: "bdd5f1"
                }, 500);
            },
            function(){
                $('#settingDiv').animate({
                    top: "0%",
                    backgroundColor: "F4F4F4"
                }, 500);
            }
        );
        $("#landpageDiv").fadeOut(800);
    });

    $(".aboutButton").click(function () {
        $("#aboutDiv").show(
            function(){
                $('#aboutDiv').animate({
                    top: "-100%",
                    backgroundColor: "bdd5f1"
                }, 500);
            },
            function(){
                $('#aboutDiv').animate({
                    top: "0%",
                    backgroundColor: "F4F4F4"
                }, 500);
            }
        );
        $("#landpageDiv").fadeOut(800);
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

        $("#landpageDiv").fadeIn(500);
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
