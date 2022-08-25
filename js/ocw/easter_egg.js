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
    if (! await itic_copilot.settings.get('itic_copilot.easter_eggs')) return;

    // 5% chance
    if (Math.random() > 0.05) return;

    const allInBody = document.querySelectorAll('*');
    for (const element of allInBody) {
        element.style.marginLeft = Math.floor(Math.random() * 30 - 5) + "px";
        element.style.marginTop = Math.floor(Math.random() * 10) + "px";
    }

    $('img[src="https://ocwitic.epsem.upc.edu/@@site-logo/logo.png"]')
    .attr('src', browser.runtime.getURL('assets/easter_eggs/ocw_sistemes_toc.png'));
})();
