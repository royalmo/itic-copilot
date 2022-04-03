/*
This file is executed when downloading all the files
of a subject in the https://ocwitic.epsem.upc.edu webpage.

It shows a window with the progress and some alerts.

This file is part of OCW-Anti-Download extension, made
by Eric Roy (royalmo). Find it and its liscence at
https://github.com/royalmo/ocw-anti-download .
*/

PROGRESS_TITLE = '<p style="font-size:20px;" align="center"><strong>{0}</strong></p>';
PROGRESS_SUBTITLE = '<p style="font-size:16px;" align="center"><em>{0}</em></p>';

subject_title = browser.i18n.getMessage("unknown"); // Placeholder
__is_downloading = false;

function fnon_is_downloading() {
    return __is_downloading;
}

function fnon_init_wait(subjtitle, subjurl) {
    subject_title = subjtitle
    __is_downloading = true;

    Fnon.Wait.CurveBar(
        PROGRESS_TITLE.replace("{0}", browser.i18n.getMessage("progress_popup_title", subject_title)) + PROGRESS_SUBTITLE.replace("{0}", browser.i18n.getMessage("progress_popup_fetching", subjurl)), {
        clickToClose: false,
        background: 'rgba(255,255,255,0.7)',
        textColor: '#000000',
        containerSize: '75%',
        fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif'
    });
}

function fnon_kill_wait() {
    Fnon.Wait.Remove();
    __is_downloading = false;
}

function fnon_update_downloading(url_or_name) {
    let endstring = PROGRESS_TITLE.replace("{0}", browser.i18n.getMessage("progress_popup_title", subject_title)) + PROGRESS_SUBTITLE.replace("{0}", browser.i18n.getMessage("progress_popup_fetching", url_or_name))

    Fnon.Wait.Change();
    Fnon.Wait.Change(endstring);
}

function fnon_update_compressing(url_or_name) {
    let endstring = PROGRESS_TITLE.replace("{0}", browser.i18n.getMessage("progress_popup_title", subject_title)) + PROGRESS_SUBTITLE.replace("{0}", browser.i18n.getMessage("progress_popup_compressing", url_or_name))

    Fnon.Wait.Change(endstring);
}

function fnon_alert(msgstr, title, okstr=browser.i18n.getMessage("close")) {
    Fnon.Alert.Warning(msgstr, title, okstr);
}

function fnon_panic(msgstr, title=browser.i18n.getMessage("error")) {
    fnon_alert(msgstr, title);
    fnon_kill_wait();
}