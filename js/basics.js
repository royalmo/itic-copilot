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

    // Load + localize
    itic_copilot.load_partial = function(relative_path) {
        return new Promise( (resolve, reject) => {
            $.ajax(browser.runtime.getURL(relative_path)).done( (content) => { 
                resolve(content.replace(/__MSG_(\w+)__/g, function(match, v1)
                {
                    return v1 ? browser.i18n.getMessage(v1) : "";
                }));
            });
        });
    };

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
                if ( (!force) && results[0] && results[1] && results[2] ) {
                    current_authentification = btoa(results[1] + ':' + results[2]);
                    resolve(current_authentification);
                    return;
                }
                itic_copilot.fnon.prompt(
                    t('itic_copilot_credentials_username'),
                    t('itic_copilot_credentials_title'))
                .then( (usr) => {
                    itic_copilot.fnon.prompt(
                        t('itic_copilot_credentials_password', "<i>" + usr + "</i>:"),
                        t('itic_copilot_credentials_title'), is_password=true)
                    .then( (pwd) => {
                        current_authentification = btoa(usr + ':' + pwd);
                        resolve(current_authentification);
                    });
                });
            });
        });
    }

    // Where subjects is a list of DB subjects
    // (i.e. [['330215', '8668__10949__330215__Q1__10', '10'], ...]),
    // it returns them in a ready-to-read way:
    // [{full_name: "... (see config/subjects.json)", groups: [11, 12]}]
    itic_copilot.parse_subjects = function (subjects) {
        return new Promise ( (resolve, reject) => {
            $.getJSON(browser.runtime.getURL('config/subjects.json'), (subject_info) => {
                var data = {};

                $.each(subjects, (i, subject) => {
                    var subject_code = subject[0];
                    var group = subject[2];

                    if (! (subject_code in data)) {
                        data[subject_code] = structuredClone(subject_info[subject_code]);
                        data[subject_code].groups = [group];
                        return;
                    }

                    if (group == 10) return;

                    if (data[subject_code].groups.length == 1
                        && data[subject_code].groups[0] == '10') {

                        data[subject_code].groups = [group];
                    } else {
                        data[subject_code].groups.push(group);
                    }
                });
                resolve(Object.values(data));
            });
        });
    }

    const QUATRIMESTER_COLORS = [
        '#3c7b23', // OPT
        '#8ad56d', // Q1
        '#7cd05b', // Q2
        '#6dcb49', // ...
        '#5fc438',
        '#56b233',
        '#4ea02e',
        '#458d28'  // Q7
    ]              // Q8 only has OPT

    // Pretty-prints a subject line.
    itic_copilot.subject_line = function(subject) {
        return ( subject.optional ?
        ('<b class="quatrimester" style="color:' + QUATRIMESTER_COLORS[0] + '">[' + t('ui_opt_subject_acronym') + ']</b>') : 
        ('<b class="quatrimester" style="color:' + QUATRIMESTER_COLORS[subject.semester] + '">[Q' + subject.semester + ']</b>') )
        + ' ' + subject.full_name + ' <i class="grouplist">' + t('ui_groups_name') + ': ' + subject.groups.join(', ') + '.</i>';
    }

    // Translations
    itic_copilot.t = browser.i18n.getMessage;

})();

// We make translations easier to read.
t = itic_copilot.t;
