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


(function () {

    // Example: https://escriny.epsem.upc.edu/svn/itic-copilot-test/bye.rst
    file_url = $('#repository-checkout-url').val();


    // Example: https://escriny.epsem.upc.edu/svn/itic-copilot-test
    repository_url = file_url.split('/', 5).join('/');

    // Example: bye.rst
    file_path = file_url.split('/').slice(5).join('/');

    // Looking for "Historial | Ver | Anotar | Descargar (| Editar) (X Bytes)"
    tmp = $('#content').children('p');
    for(i = 0; i<tmp.length; i++) {
        if (tmp.eq(i).text().split('|').length-1 === 3) {
            submenu_paragraph = tmp.eq(i);
            break;
        }
    }

    // If we are not in a possible edit page, we exit
    if (typeof submenu_paragraph === "undefined") return;

    // If edit is disabled by settings, we exit too
    itic_copilot.settings.get("escriny.edit_files").then( value => {
        if (value) escriny_render_edit_menu(); // TODO better name/way (?)
    });

// I put the indentation here because it will most likely continue from before.
function escriny_render_edit_menu() {

    startstr = submenu_paragraph.html();
    // Adding url to current view
    splitted = startstr.split('|')
    for(i = 0; i<splitted.length; i++) {
        if(splitted[i].includes("</a>")) continue;
        
        word = splitted[i].replace(/\s+/g, '');
        splitted[i] = ' <i id="copilot_current_phar">' + word + '</i><a id="copilot_current_link" style="display:none;">' + word + '</a> ';
        break;
    }
    startstr = splitted.join('|');

    // Adding | Editar
    splitted = startstr.split('(');
    startstr = splitted[0] + '| <i id="copilot_edit_phar" style="display:none">' + t('escriny_edit_text') + '</i><a id="copilot_edit_link">' + t('escriny_edit_text') + '</a> (' + splitted[1];

    // | <a id="copilot_delete_link">Eliminar</a>

    submenu_paragraph.html(startstr)

    $('#content').children().last().attr('id', 'original_content');
    original_content = $('#original_content');

    // Adding editor content
    $('#content').html($('#content').html()
        + '<div id="editor_content" style="display:none;"><div class="toolbar-input-group">'
        + '<input type="text" id="new_commit_msg" style="width:50%" placeholder="'
        + t('escriny_commit_message_placeholder')
        + '"/><button class="button" style="margin:0" id="commit_btn">'
        + t('escriny_commit_title')
        + '</button></div><p style="display:none;font-size:12px"><i><a href="javascript:void(0)" id="copilot_edit_settings_show">'
        + t('escriny_show_advanced_settings')
        + '</a><a href="javascript:void(0)" id="copilot_edit_settings_hide" style="display:none">'
        + t('escriny_hide_advanced_settings')
        + '</a></i></p><div style="display:none" id="copilot_advanced_settings_div"><p> CR CRLF LF </p>'
        + '</div><br/><div id="editor" style="width:100% max-width:300px;height:700px;outline: solid 2px darkgrey;">'
        + t('escriny_load_file_placeholder')
        + '</div></div><div id="editor_content_loading><p>'
        + t('escriny_load_file_placeholder')
        + '</p><p>'
        + t('escriny_load_file_error')
        + '</p></div>');

    // ACE init
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/textmate");
    editor.setOptions({ maxLines: Infinity });
    editor.setAutoScrollEditorIntoView(true);
    editor.setShowInvisibles(true);

    //editor.session.setMode("ace/mode/javascript"); TODO ADD HIGHLITING

    file_contents_loaded = false

    // Prompting if needed when saves occur.
    function preventChangeLoss(event) {
        if (editor.session.getUndoManager().hasUndo())
            event.returnValue = null; // if it isn't null, prompt is hidden.
    }
    window.addEventListener("beforeunload", preventChangeLoss);

    $(function () {
        $('#copilot_edit_settings_show').click(function() {
            $('#copilot_advanced_settings_div').show();
            $('#copilot_edit_settings_show').hide();
            $('#copilot_edit_settings_hide').show();
        });
        $('#copilot_edit_settings_hide').click(function() {
            $('#copilot_advanced_settings_div').hide();
            $('#copilot_edit_settings_show').show();
            $('#copilot_edit_settings_hide').hide();
        });

        $('#copilot_current_link').click(function () {
            $('#copilot_current_link').hide();
            $('#copilot_current_phar').show();
            $('#copilot_edit_link').show();
            $('#copilot_edit_phar').hide();

            $('#original_content').show();
            $('#editor_content').hide();
        });
        $('#copilot_edit_link').click(function () {
            $('#copilot_current_link').show();
            $('#copilot_current_phar').hide();
            $('#copilot_edit_link').hide();
            $('#copilot_edit_phar').show();

            $('#original_content').hide();
            $('#editor_content').show();
            editor.focus();

            if (file_contents_loaded) return;

            itic_copilot.get_basic_auth().then( auth => {

                $.ajax({
                    url: file_url,
                    method: 'get',
                    cache: false,
                    headers: {
                        "Authorization" : "Basic " + auth
                    },
                    success: function(result) {
                        editor.setValue(result);
                        editor.navigateFileStart();
                        file_contents_loaded = true;
                        editor.getSession().getUndoManager().reset();
                    },
                    error: function() {
                        itic_copilot.fnon.alert(
                            t('escriny_fetching_error'),
                            t('ocw_downloader_error')
                        );

                        // Showing back old menu
                        $('#copilot_current_link').hide();
                        $('#copilot_current_phar').show();
                        $('#copilot_edit_link').show();
                        $('#copilot_edit_phar').hide();

                        $('#original_content').show();
                        $('#editor_content').hide();
                    }
                });
            });
        });

        $('#commit_btn').click(function() {
            commit_message = $('#new_commit_msg').val();
            if (commit_message == "") return;

            itic_copilot.fnon.confirm(
                t('escriny_commit_title'),
                t('escriny_commit_confirm_text', "<i>"+commit_message+"</i>"),
                t('escriny_confirm_continue'),
                t('ocw_downloader_cancel'),
            (result)=>{
                if (!result) return;

                itic_copilot.get_basic_auth().then( auth => {

                    // SVNJS 0.1.0
                    var svn = new SVN(auth, repository_url);
                    // SVNJS 0.2.0
                    // var svn = new svnjs.Client(prompt("Username:"), prompt("Password:"), repository_url);
                    
                    svn.add(file_path, editor.getValue());
                    svn.commit(commit_message, function () {
                        editor.getSession().getUndoManager().reset();
                        editor.focus();
                        $('#new_commit_msg').val("");
                        itic_copilot.fnon.alert(
                            t('escriny_commit_completed_text'),
                            t('escriny_commit_completed_title')
                        );
                    });
                });
            });
        });
    });
} // End function escriny_render_edit_menu

})();
