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
    if (! (/https?:\/\/(www\.)?ocwitic\.epsem\.upc\.edu(\/$|(\/#)|\/\?|$)/gm.test(window.location.href)
    && await itic_copilot.settings.get('ocw.show_landpage'))) return;

    content = await itic_copilot.load_partial('html/ocw_landpage.html')
    $('#main-container').html(content);

    subjects = await itic_copilot.settings.get('subjects').then(s =>
        itic_copilot.parse_subjects(s)
    );

    lang = await itic_copilot.settings.get('course_guides.language');

    if (subjects.length == 0) return;

    tablecontent = "";

    $.each(subjects, (i, subject) => {
        if (subject.ocw_name) {
            tablecontent += '<tr class="ocwsubject"><td><a ' +
            'class="copilot_landpage_link" ' + 
            'href="https://ocwitic.epsem.upc.edu/assignatures/' + 
            subject.ocw_name + '">' + itic_copilot.subject_line(subject) +
            '<button onclick="return false;" class="download_subject_landpage">'
            + t('ocw_replacer_download_all') + "</button></a></td></tr>";
        }
        else {
            tablecontent += '<tr class="ocwnotfound"><td>'
            + itic_copilot.subject_line(subject)
            + '<i style="font-size:80%;color:#007bb1;">'
            + t('ocw_replacer_not_available')
            + "</i></td></tr>";
        }
    });

    $('#your-subjects-placeholder').hide();
    $('#your-subjects-table').show().append(tablecontent);

    $('.download_subject_landpage').click(function(e) {
        link = $(e.target).parent().attr('href');

        // https://stackoverflow.com/a/8851526/9643618
        subject_name = $(e.target).parent().clone().children()
        .remove().end().text().trim();

        // Part from file_downloader.js:download_subject(e)
        itic_copilot.log("ocw_start_subject_download", [subject_name, link]);
        itic_copilot.fnon.wait(subject_name, link);

        // Creating File Tree
        tree = new itic_copilot.tree.OcwTree(link, subject_name);
        itic_copilot.ocw.download_folder_recursive(tree.root).then(
            itic_copilot.ocw.download_folder_continuation
        );
    })
})();
