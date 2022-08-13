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
    // We will not click on the login button if the login has failed 
    failed_login = $('.error_msg').length // 1 if failed, 0 if not

    // Adding the two checkboxes
    $('.remember_button_cl').after('<div style="font-style:italic;"><p><label style="display:unset;font-size:12px;color:var(--color-base);"><input name="copilot_remember_credentials" type="checkbox"/> ' + t('autologger_remember_credentials') + '</label></p><p><label style="display:unset;font-size:12px;color:var(--color-base);"><input name="copilot_autologin" type="checkbox"/> ' + t('autologger_enable_autologin') + '</label></p></div>');

    usr_input = $('#edit-name');
    pwd_input = $('#edit-pass');
    log_button = $('#submit_ok');

    copilot_remember = $('input[name="copilot_remember_credentials"]');
    copilot_autologin = $('input[name="copilot_autologin"]');

    itic_copilot.autologger(usr_input, pwd_input, log_button,
        copilot_remember, copilot_autologin, failed_login);
})();
