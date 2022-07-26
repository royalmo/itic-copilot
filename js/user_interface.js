let checkboxesId = new Array();

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
        if ($(this).attr("id") == "saveUPC") {
            $(".upcLog").toggle('swing');
        }
    });

    $(".tableLinksTr").click(function() {
        window.open($(this).data("href"));
    });


    function storeCheckboxes(){
        
        let checkboxes = document.querySelectorAll('input[type=checkbox]');
        for (const value of checkboxes.values()){
            checkboxesId.push(value.id);
            window.localStorage.setItem(value.id, String(document.getElementById(value.id).checked));
        }
        };
    
    console.log(checkboxesId)
    if(localStorage.length > 0){
        for (let checkboxName of checkboxesId ){
            console.log(checkboxName)
            let checkboxValue = JSON.parse(localStorage.getItem(checkboxName));
            document.getElementById(checkboxName).checked = checkboxValue;
            $("#"+ document.getElementById(checkboxName)).prop('checked', checkboxValue);
            if (document.getElementById(checkboxName).checked) {
                //$("#"+ document.getElementById(checkboxName)).click();
                console.log("CHECKED");
            }
            else {
                console.log("Not Checked");
            }
        };
    }
    window.addEventListener('change', storeCheckboxes);
});
