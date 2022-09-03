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

    // Waiting for page load (it could be any elemment)
    await itic_copilot.waitForElm('.formatting-btn');

    // Removing premium pop-up
    $('.formatting-btn').click(function () {
        $('.symbol-palette-overlay').remove();
    });

    $('.online-users').after('<div class="toolbar-item"><button id="copilot_escriny_commit" class="btn btn-full-height"><i class="fa fa-upload fa-fw"></i><p class="toolbar-label">Commit on escriny</p></button></div>');

    $('#copilot_escriny_commit').click( function () {

    });
})();
