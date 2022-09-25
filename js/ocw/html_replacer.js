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

// This file adds extra links into the ocw pages.

itic_copilot.ocw = {};

(function () {
    var links = document.querySelectorAll("a");
    var i;

    for (i = 0; i<links.length; i++) {

        // Removing fored download
        if (links[i].href.includes("@@download") &&
        !links[i].children[0].src.endsWith("++resource++mimetype.icons/text.png")) {
            console.log(links[i].children[0].src);
            links[i].parentElement.innerHTML = links[i].parentElement.innerHTML
            + '<a class="copilot_file_view" href="'
            + links[i].href.replace("@@download", "@@display-file")
            + '" style="display:none;color:grey;font-size:10px">[<em>'
            + t('ocw_replacer_view') + '</em>]</a>';
        }

        // Add download to all if we are seeing a folder
        if (links[i].classList.contains('navTreeCurrentItem')
        && links[i].classList.contains('contenttype-folder')) {
            document.getElementById('viewlet-below-content-title').innerHTML +=
            '<p><a class="copilot_download_folder" style="display:none;'
            + 'color:#007bb1;font-size:13px;" href="javascript:void(0)"> [<em>'
            + t('ocw_replacer_download_all') + '</em>]</a></p><br/>';
        }
    }

    var spans = document.querySelectorAll("span");

    for (i = 0; i<spans.length; i++) {
        if (!spans[i].classList.contains('summary')) continue;

        // Extra view links to file (on menu)
        if (spans[i].children[0].classList.contains('contenttype-file') &&
        !spans[i].children[0].children[0].src.endsWith("++resource++mimetype.icons/text.png")) {
            spans[i].innerHTML = spans[i].innerHTML
            + '<a class="copilot_file_view" href = "'
            + spans[i].children[0].href.replace('/view', '')
            + '" style="display:none;color:grey;font-size:10px">[<em>'
            + t('ocw_replacer_view') + '</em>]</a>';
        }

        // Download entire subject (on menu)
        if (spans[i].children[0].classList.contains('contenttype-assignatura')) {
            spans[i].innerHTML = spans[i].innerHTML
            + '<a class="copilot_download_subject" style="display:none;'
            + 'color:#2F4F4F; font-size:10px;" href="javascript:void(0)"> [<em>'
            + t('ocw_replacer_download_all') + '</em>]</a>';
        }
    }

    // Adding download subjects links
    var subjects = document.querySelectorAll("dd");

    for (i = 0; i<subjects.length; i++) {
        if (! subjects[i].classList.contains('doormatSectionBody')) continue;

        subjects[i].innerHTML = subjects[i].innerHTML
        + '<a class="copilot_download_subject" style="display:none;'
        + 'color:#2F4F4F; font-size:10px;" href="javascript:void(0)"> [<em>' 
        + t('ocw_replacer_download_all') + '</em>]</a>';
    }

    // Adding download quadrimester links
    var quadrimesters = document.querySelectorAll("dt");

    for (i = 0; i<quadrimesters.length; i++) {
        if (!quadrimesters[i].classList.contains('doormatSectionHeader')) continue;

        quadrimesters[i].innerHTML = quadrimesters[i].innerHTML
        + '<a class="copilot_download_quadrimester" style="display:none;'
        + 'color:#bfbbb2;font-size:10px;" href="javascript:void(0)"> [<em>'
        + t('ocw_replacer_download_all') + '</em>]</a>';
    }

    itic_copilot.log('ocw_done_link_replacement');

    itic_copilot.ocw.toggle_links = function(value) {
        $(function() {
            $('.copilot_file_view').toggle(value);
            $('.copilot_download_folder').toggle(value);
            $('.copilot_download_subject').toggle(value);
            $('.copilot_download_quadrimester').toggle(value);
        });

        itic_copilot.log( value ? 'ocw_links_shown' : 'ocw_links_hidden' );
    }

    itic_copilot.ocw.show_links = function() { itic_copilot.ocw.toggle_links(true)  };
    itic_copilot.ocw.hide_links = function() { itic_copilot.ocw.toggle_links(false) };

})();
