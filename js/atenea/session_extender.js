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
    if (! await itic_copilot.settings.get('atenea.extend_session')) return;

    EXTEND_SESSION_STRINGS = ["Estén la sessió", "Extend session", "Extender sesión"];
    SELECTOR = 'button.btn-primary[data-action="save"]';

    while (true) {
        await itic_copilot.waitForElm(SELECTOR);
        console.log($(SELECTOR).html())
        if (EXTEND_SESSION_STRINGS.includes($(SELECTOR).html())) {
            $(SELECTOR).click();
            itic_copilot.log("Session extended!");
        }
    }
})();
