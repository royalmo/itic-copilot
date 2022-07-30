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
    file_path = 'hello.rst'; // TODO

    // Looking for "Historial | Ver | Anotar | Descargar (| Editar) (X Bytes)"
    tmp = $('#content').children('p');
    for(i = 0; i<tmp.length; i++) {
        if (tmp.eq(i).text().split('|').length-1 === 3) {
            submenu_paragraph = tmp.eq(i);
            break;
        }
    }

    if (typeof submenu_paragraph === "undefined") return;

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
    startstr = splitted[0] + '| <i id="copilot_edit_phar" style="display:none">Editar</i><a id="copilot_edit_link">Editar</a> (' + splitted[1];

    submenu_paragraph.html(startstr)

    $('#content').children().last().attr('id', 'original_content');
    original_content = $('#original_content');

    // Adding editor content
    $('#content').html($('#content').html() + '<div id="editor_content" style="display:none;"><input type="text" id="new_commit_msg"/><button id="commit_btn">Commit</button><div id="editor" style="width:100% max-width:300px;height:700px;outline: solid 2px darkgrey;">' + "Loading file contents..." + '</div></div>');

    // ACE init
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/textmate");
    editor.setOptions({ maxLines: Infinity });
    editor.setAutoScrollEditorIntoView(true);
    editor.setShowInvisibles(true);

    //editor.session.setMode("ace/mode/javascript"); TODO ADD HIGHLITING

    file_contents_loaded = false

    $(function () {
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

            $.ajax({
                url: file_url,
                method: 'get',
                cache: false,
                headers: {
                    "Authorization" : "Basic " + btoa(prompt("username") + ':' + prompt("password"))
                },
                success: function(result) {
                    editor.setValue(result);
                    editor.navigateFileStart();
                    file_contents_loaded = true;
                },
                error: function() {
                    alert('An error occurred while fetching the url.');
                }
            });
        });

        $('#commit_btn').click(function() {
            commit_message = $('#new_commit_msg').val();

            // SVNJS 0.1.0
            var svn = new SVN(prompt("Username"), prompt("Password"), repository_url);
            // SVNJS 0.2.0
            // var svn = new svnjs.Client(prompt("Username:"), prompt("Password:"), repository_url);
            
            svn.add(file_path, editor.getValue());
            svn.commit(commit_message, function () {alert("Done!")});
        });
    })
})();