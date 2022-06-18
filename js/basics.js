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

// Setting up namespace
itic_copilot = {};


(function() {

    // Debug functions
    itic_copilot.log = function(str) {
        console.log(
            browser.i18n.getMessage('log_copilot_name') + 
            browser.i18n.getMessage('log_' + str)
        );
    }

    itic_copilot.error = function(str) {
        console.log(
            "[ERROR]" +
            browser.i18n.getMessage('log_copilot_name') + 
            browser.i18n.getMessage(str)
        );
    }

    // Other utils
    itic_copilot.os = (function() {
        /* Returns "Windows", "Linux", "MacOS" */
        /* Default value (if not found) is Windows */
        let os_info = jscd.os;
        if (os_info.includes("Linux")) return "Linux";
        if (os_info.includes("Mac")) return "MacOS";
        return "Windows";
    })();

    // Translations
    itic_copilot.t = browser.i18n.getMessage;

})();

// We make translations easier to read.
t = itic_copilot.t;
