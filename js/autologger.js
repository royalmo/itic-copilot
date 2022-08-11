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

(function () {
    itic_copilot.autologger = function(usr_input, pwd_input, log_button,
        copilot_remember_check, copilot_autologin_check, is_failed_login) {

        Promise.all([
            itic_copilot.settings.get('itic_copilot.save_upcnet_credentials'),
            itic_copilot.settings.get('upcnet.autologin'),
            itic_copilot.settings.get('upcnet.username'),
            itic_copilot.settings.getPTP()            
        ]).then( results => {
            copilot_remember_check.prop('checked', results[0]);
            copilot_autologin_check.prop('disabled', !results[0]);
            copilot_autologin_check.prop('checked', results[1]);

            if (results[0]) {
                usr_input.val(results[2]);
                pwd_input.val(results[3]);

                if (results[1] && results[2] && results[3] && (!is_failed_login)) {
                    log_button.click();
                    return;
                }
            }

            // If we arrive here, no autologin has been done, user can interact
            log_button.click(function () {
                if (!copilot_remember_check.is(':checked')) return;

                new_username = usr_input.val();
                if (new_username != results[2])
                    itic_copilot.settings.set('upcnet.username', new_username);

                new_password = pwd_input.val();
                if (new_password != results[3])
                    itic_copilot.settings.set('upcnet.password', new_password);
            });

            copilot_remember_check.change( () => {
                new_value = copilot_remember_check.is(':checked');
                itic_copilot.settings.set('itic_copilot.save_upcnet_credentials', new_value);
                copilot_autologin_check.prop('disabled', !new_value);

                // Saving or deleting credentials
                usr = new_value ? usr_input.val() : "";
                pwd = new_value ? pwd_input.val() : "";

                itic_copilot.settings.set("upcnet.username", usr);
                itic_copilot.settings.set("upcnet.password", pwd);
            });

            copilot_autologin_check.change( () => {
                itic_copilot.settings.set('upcnet.autologin',
                    copilot_autologin_check.is(':checked'));
            });
        });
    }
})();