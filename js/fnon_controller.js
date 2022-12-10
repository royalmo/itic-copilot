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

itic_copilot.fnon = {};

(function () {

    __html_template = '<p style="font-size:20px;color:#2841b5;" align="center"><strong>{0}</strong></p> <br/>\
                    <div id="fnon_content"></div> <br/>\
                    <a class="fnon_kill_wait" style="color:red;background:lightyellow;"href="javascript:void(0)"><strong><em>' + 
                    t("ocw_downloader_cancel") + '</strong></em></a>';

    __wait_active = false;

    itic_copilot.fnon.is_downloading = function() {return __wait_active;}
    
    itic_copilot.fnon.wait = function (fnon_title) {
        __wait_active = true;

        Fnon.Wait.CurveBar(
            __html_template.replace("{0}", fnon_title), {
            clickToClose: false,
            background: 'rgba(255,255,255,0.7)',
            textColor: '#000000',
            containerSize: '75%',
            fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif'
        });

        $(function() {
            $('a.fnon_kill_wait').click( function() {
                itic_copilot.log('ocw_cancel_download');
                itic_copilot.fnon.kill_wait();
            });
        });
    }

    itic_copilot.fnon.kill_wait = function () {
        if (!__wait_active) return;

        Fnon.Wait.Remove();
        __wait_active = false;
    }

    itic_copilot.fnon.update_wait = function (content) {
        document.getElementById('fnon_content').textContent = '<p style="font-size:16px;color:#1f7dde;" align="center"><em>' + content + '</em></p>';
    }

    itic_copilot.fnon.alert = function (message, title, okey=t("ocw_downloader_close"), autoremove=true) {
        if (autoremove) {
            var alert_timeout = setTimeout(function() {
                $("button.f__btn").first().click();
            }, 10000);
        }

        Fnon.Alert.Warning(message, title, okey, function() {clearTimeout(alert_timeout);});
    }

    itic_copilot.fnon.prompt = function (message, title, is_password=false) {
        promptmsg = '<p>'+message+'</p><input id="itic_copilot_fnon_prompt" type="'
                    + (is_password ? 'password' : 'text') + '" />';
        return new Promise((resolve, reject) => {
            Fnon.Alert.Warning(promptmsg, title, "Continue", () => {
                resolve($('#itic_copilot_fnon_prompt').val())
            });

            // Focusing and binding enter key
            $('body').on('keypress', '#itic_copilot_fnon_prompt', function(args) {
                if (args.keyCode == 13) {
                    $(".f__btn").first().click();
                    return false;
                }
            });

            setTimeout( () => { $('#itic_copilot_fnon_prompt').focus(); }, 500);
        });
    }

    itic_copilot.fnon.confirm = function (title, message, yes_str, no_str, callback) {
        Fnon.Ask.Danger(message, title, yes_str, no_str, callback);
    }


    // More specific functions
    itic_copilot.fnon.panic = function (message, title=t('ocw_downloader_error')) {
        itic_copilot.fnon.alert(message, title);
        itic_copilot.fnon.kill_wait();
    }

})();