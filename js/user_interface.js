/*
 * Copyright (C) 2022 Eric Roy
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see http://www.gnu.org/licenses/.
*/

let checkboxesId = new Array();

$(document).ready(function () {
    let checkboxes = document.querySelectorAll('input[type=checkbox]');
    
    for (const value of checkboxes.values()){
        checkboxesId.push(value.id);
    }

    for (let checkboxName of checkboxesId ){
        let checkboxValue = chrome.storage.sync.get([checkboxName], (result) => {
                console.log(`Retrieved ${checkboxName} value: ` + result);
            });
        console.log(`checkbox value: ${checkboxValue}`);
        document.getElementById(checkboxName).checked = checkboxValue;
        $("#"+ checkboxName).prop('checked', checkboxValue);

    }

    // ANIMATIONS BETWEEN WINDOW'S SECTIONS
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

    // FORM TOGGLE
    $('input[type="checkbox"]').click(function () {
        if ($(this).attr("id") == "saveUPC") {
            $(".upcLog").toggle('swing');
        }
    });

    // MAKES ROW A HYPERLINK TO SITE
    $(".tableBigTr").click(function() {
        window.open($(this).data("href"));
    });

    $(".tableSmallTd").click(function() {
        window.open($(this).data("href"));
    });

    // STORING VALUES IN LOCAL STORAGE BROWSER
    function storeCheckboxes(){
        for (const value of checkboxes.values()){
            let valueID = value.id;
            checkboxesId.push(valueID);
            chrome.storage.sync.set({valueID : String(document.getElementById(value.id).checked)}, () => {
                console.log(`${value.id} is set to ` + String(document.getElementById(value.id).checked));
                });
        }
    };
           
    window.addEventListener('change', storeCheckboxes);
});


