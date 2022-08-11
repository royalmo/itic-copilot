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
    itic_copilot.log = function(str, args) {
        console.log(
            browser.i18n.getMessage('log_copilot_name') + 
            browser.i18n.getMessage('log_' + str, args)
        );
    }

    itic_copilot.error = function(str, args) {
        console.log(
            "[ERROR]" +
            browser.i18n.getMessage('log_copilot_name') + 
            browser.i18n.getMessage('log'+str, args)
        );
    }

    // Other utils
    itic_copilot.os = (function() {
        /* Returns "Windows", "Linux", "MacOS" */
        /* Default value (if not found) is Windows */
        let os_info = typeof jscd === "undefined" ? "Undefined" : jscd.os;
        if (os_info.includes("Linux")) return "Linux";
        if (os_info.includes("Mac")) return "MacOS";
        return "Windows";
    })();

    current_authentification = null
    // Basic auth used in SVNJS
    itic_copilot.get_basic_auth = function(force = false) {
        if (current_authentification !== null && !force)
            return Promise.resolve(current_authentification);

        return new Promise((resolve, reject) => {

            // Checking settings
            Promise.all([
                itic_copilot.settings.get("itic_copilot.save_upcnet_credentials"),
                itic_copilot.settings.get("upcnet.username"),
                itic_copilot.settings.getPTP()
            ]).then( results => {
                // Checking if user is saving credentials and has some ids
                if ( (!force) && results[0] && results[1] && results[2] )
                    current_authentification = btoa(results[1] + ':' + results[2]);
                else {
                    usr = prompt('Introduce your username');
                    pwd = prompt('Introduce your password');
                    current_authentification = btoa(usr + ':' + pwd);
                }

                resolve(current_authentification);
            });
        });
    }

    // Translations
    itic_copilot.t = browser.i18n.getMessage;

})();

// We make translations easier to read.
t = itic_copilot.t;
