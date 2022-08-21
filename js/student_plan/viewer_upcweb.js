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
    scroll_to_plan = window.location.href.endsWith('#plan');

    if (scroll_to_plan) {
        $(document).ready( function () {
            var select = $('a[href="#collapse-images-collapse-curriculum"]');

            $('#collapse-images-collapse-curriculum')
            .attr('style', '').attr('aria-expanded', 'true')
            .addClass('in');
            select.attr('aria-expanded', 'true').attr('class', '');

            var offTop = select.offset().top - 100;
            //$(document).scrollTop(offTop); does nothing in Chrome ...
            window.scrollTo({top: offTop, behavior: 'smooth'});
        });
    }

    content = await itic_copilot.load_partial('html/course_guides.html')
    $('#collapse-images-collapse-curriculum').prepend(content);

    subjects = await itic_copilot.settings.get('subjects').then(s =>
        itic_copilot.parse_subjects(s)
    );

    lang = await itic_copilot.settings.get('course_guides.language');

    if (subjects.length == 0) return;

    tablecontent = "";

    $.each(subjects, (i, subject) => {
        tablecontent += "<tr><td>" + itic_copilot.subject_line(subject)
        + '<a target="_blank" href="https://www.upc.edu/content/grau/guiadocent/pdf/'
        + lang + '/' + subject.upc_code + '" style="font-size:80%;font-style:italic;">'
        + t('course_guides_button') + "</a></td></tr>";
    });

    $('#your-subjects-placeholder').hide();
    $('#your-subjects-table').show().append(tablecontent);
})();
