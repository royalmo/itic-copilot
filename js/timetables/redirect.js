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

$(document).ready(function () {
    form = $('#form');

    // Adding action URL
    $.getJSON(browser.runtime.getURL('/config/links.json'), function(links) {
        form.attr('action', links['see_schedule']);

        // Adding current subjects
        itic_copilot.settings.get('subjects').then( subjects => {

            subjects.forEach(subj => { // subj[1] is the full code
                form.append('<input type="checkbox" value="' + subj[1] + '" name="checkbox[]" checked>');
            });

            // Sending
            form.submit();
        });
    });
});
