/*
This file is executed when downloading all the files
of a subject in the https://ocwitic.epsem.upc.edu webpage.

It shows a window with the progress and some alerts.

This file is part of iTIC Copilot extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/itic-copilot .
*/

PROGRESS_HTML = '<p style="font-size:20px;color:#2841b5;" align="center"><strong>{0}</strong></p> <br/>\
                <div id="fnon_content"></div> <br/>\
                <a class="fnon-kill-wait" style="color:red;background:lightyellow;" href="#"><strong><em>' + 
                browser.i18n.getMessage("progress_popup_cancel") + '</strong></em></a>';

subject_title = browser.i18n.getMessage("unknown"); // Placeholder
__is_downloading = false;

function fnon_is_downloading() {
    return __is_downloading;
}

function fnon_init_wait(subjtitle, subjurl) {
    subject_title = subjtitle
    __is_downloading = true;

    Fnon.Wait.CurveBar(
        PROGRESS_HTML.replace("{0}", browser.i18n.getMessage("progress_popup_title", subject_title)), {
        clickToClose: false,
        background: 'rgba(255,255,255,0.7)',
        textColor: '#000000',
        containerSize: '75%',
        fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif'
    });

    $(function() {
        $('a.fnon-kill-wait').click(fnon_kill_wait);
    });
}

function fnon_kill_wait() {
    Fnon.Wait.Remove();
    __is_downloading = false;
}

function fnon_update_downloading(url_or_name) {
    document.getElementById('fnon_content').innerHTML = '<p style="font-size:16px;color:#1f7dde;" align="center"><em>' + browser.i18n.getMessage("progress_popup_fetching", url_or_name) + '</em></p>';
}

function fnon_update_compressing(url_or_name) {
    document.getElementById('fnon_content').innerHTML = '<p style="font-size:16px;color:#1f7dde;" align="center"><em>' + browser.i18n.getMessage("progress_popup_compressing", url_or_name) + '</em></p>';
}

function fnon_alert(msgstr, title, okstr=browser.i18n.getMessage("close"), autoremove=true) {
    if (autoremove) {
        let alert_timeout = setTimeout(function() {
            $("button.f__btn").first().click();
        }, 10000);
    }

    Fnon.Alert.Warning(msgstr, title, okstr, function() {clearTimeout(alert_timeout);});
}

function fnon_panic(msgstr, title=browser.i18n.getMessage("error")) {
    fnon_alert(msgstr, title);
    fnon_kill_wait();
}
