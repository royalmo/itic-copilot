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

(async function () {
    // We do nothing in the projects menu.
    if (window.location.href.endsWith('/project/')
        || window.location.href.endsWith('/detached')) return;

    if (! await itic_copilot.settings.get("overleaf.commit_to_escriny")) return;

    // Waiting for page load (it could be any elemment)
    await itic_copilot.waitForElm('.formatting-btn');

    // Removing premium pop-up
    $('.formatting-btn').click(function () {
        $('.symbol-palette-overlay').remove();
    });

    $('.online-users').after('<div class="toolbar-item"><button id="copilot_escriny_commit" class="btn btn-full-height"><i class="fa fa-upload fa-fw"></i><p class="toolbar-label">' + t('overleaf_commit_to_escriny') +'</p></button></div>');

    $('#copilot_escriny_commit').click(async function () {
    
        itic_copilot.fnon.confirm(t("overleaf_commit_to_escriny"),
            await itic_copilot.load_partial("html/commit_menu.html"),
            t("escriny_commit_title"), t("ocw_downloader_cancel"), function(){}
        );

        data = await new JSZip.external.Promise(function (resolve, reject) {
            JSZipUtils.getBinaryContent( window.location.href + '/download/zip', function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
        zip = await JSZip.loadAsync(data);
        texts = zip.file(/^.+\.tex$/);

        if (texts.length == 0) {
            $('.f__btn').first().click();
            itic_copilot.fnon.alert(t("overleaf_no_tex_description"), t("overleaf_no_tex_title"));
            return;
        }

        file_contents = await texts[0].async("string");
        var repository_id, file_path, commit_message;
        
        $('.copilot_input').change(function () {
            repository_id = $('#copilot_escriny_repo').val();
            file_path = $('#copilot_escriny_path').val();
            commit_message = $('#copilot_commit_msg').val();
        });

        $('.f__btn[data-evt="tr"]').click(async function () {
            repository_url = 'https://escriny.epsem.upc.edu/svn/' + repository_id;
            auth = await itic_copilot.get_basic_auth();
            // SVNJS 0.1.0
            var svn = new SVN(auth, repository_url, backgroundAjax=true);
            svn.add(file_path, file_contents);
            svn.commit(commit_message, function () {
                itic_copilot.fnon.alert(
                    t('escriny_commit_completed_text'),
                    t('escriny_commit_completed_title')
                );
            },  function () {
                itic_copilot.fnon.alert(
                    t('log_ocw_error_download'),
                    t('overleaf_bad_auth_or_path')
                );
            });
        });
    });
})();
