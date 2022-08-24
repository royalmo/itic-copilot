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
    var content = await itic_copilot.load_partial('html/escriny_landpage.html');

    $('.homescreen--links, .widget-box.news, .widget-box.upsale').remove();
    $('.widget-box.new_features').html(content);

    $('#private_projects_iframe').on("load", function() {

        // Getting iframe data
        var iframe = document.getElementById('private_projects_iframe');
        var data = iframe.contentDocument || iframe.contentWindow.document;

        $('#copilot_private_repos_placeholder').hide();

        // Parsing
        var tbody= jQuery(data).find("tbody");

        // Checking if there is at leas one private repo
        if (tbody.first().find('.icon-context.icon-checkmark').length == 1) {
            $('#copilot_no_repos').show();
            return;
        }

        $('#copilot_private_repos').show();
        var repositories = tbody.children();

        for (var i = 0; i<repositories.length; i++) {
            current = $(repositories[i]);

            if (current.find('.icon-context.icon-checkmark').length == 1)
                break;
            if (current.hasClass('project-description'))
                continue;
            
            var anchor = current.find('a').first();

            var name = anchor.html();
            var url = anchor.attr('href') + '/repository';
            $('#copilot_private_repos').append('<li><a href="' + url + '">' + name + '</a></li>');
        }
        
    })
})();