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

$(document).ready(function () {
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
            configure_links(only_variable=true);
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

    // LINK REFERENCING
    $('body').on('click', 'a, button.href, tr.tableBigTr', function(){
        browser.tabs.create({url: $(this).attr('href')});
        return false;
    });

    // FORM TOGGLE
    $('input[name="itic_copilot.save_upcnet_credentials"]').click(
        function () {enable_disable_credentials(do_not_save=false);}
    );

    $('#reset_settings_btn').click( function () {
        itic_copilot.settings.reset().then(load_settings).then(() => $('#settings_reset_msg').fadeTo(200, 1).delay(5000).fadeTo(1000, 0));
    });

    $('input[type="checkbox"]').click( function () {
        itic_copilot.settings.set($(this).attr("name"), $(this).is(':checked'))
        console.log("Saved " + $(this).attr("name") + ": " + $(this).is(':checked'));
    });

    $('input[type="text"], input[type="password"], select').focusout( function () {
        itic_copilot.settings.set($(this).attr("name"), $(this).val())
        console.log("Saved " + $(this).attr("name") + ": " + $(this).val());
    });

    load_settings();
    configure_links();
});

function load_settings () {
    return new Promise((resolve, reject) => {
        itic_copilot.settings.getAll().then(function (settings) {
            $.each(settings, function(key, value) {
                if ($('[name="' + key + '"]').length == 0) return;

                if ($('[name="' + key + '"]').attr('type') == 'checkbox') {
                    $('input[name="' + key + '"]').prop( "checked", value );
                }
                else { // text, password or select
                    $('[name="' + key + '"]').val(value);
                }
            });
            console.log("Settings updated!")

            setTimeout(function () {enable_disable_credentials(do_not_save=true);}, 100); 
            resolve();
        });
    });
}

function enable_disable_credentials (do_not_save = false) {
    save_credentials = $('input[name="itic_copilot.save_upcnet_credentials"]').is(':checked');

    $('input[name="upcnet.username"],input[name="upcnet.password"],input[name="upcnet.autologin"]').attr('disabled', !save_credentials);
    $('#autologin_slider').toggleClass('disabled', !save_credentials);

    if (do_not_save) return;

    // Saving or deleting credentials
    usr = save_credentials ? $('input[name="upcnet.username"]').val() : "";
    pwd = save_credentials ? $('input[name="upcnet.password"]').val() : "";

    itic_copilot.settings.set("upcnet.username", usr);
    itic_copilot.settings.set("upcnet.password", pwd);
}

function configure_links (only_variable=false) {
    $.getJSON(browser.extension.getURL('/config/links.json'), function(links) {
        // Setting up gmail url
        itic_copilot.settings.get("upcnet.gmail_url").then(function (value) {
            $('a[key="upcnet.gmail_url"]').attr('href', value);
        })

        // Setting up course guides language
        itic_copilot.settings.get("course_guides.language").then(function (value) {
            $('a[key="course_guides"]').attr('href', links["course_guides_"+value]);
        });

        if(only_variable) return;

        // Setting up all constant links
        $('a[type="constant"], tr[type="constant"').each(function () {
            $(this).attr('href', links[$(this).attr('key')]);
        });
        $('button[name="new_schedule"]').attr('href', links["new_schedule"]);
    });
}
