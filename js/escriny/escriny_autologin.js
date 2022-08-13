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
    failed_login = $('.flash.error.icon.icon-error').length // 1 if failed, 0 if not

    // Adding the two checkboxes
    $('form.user-login--form').after('<div style="font-style:italic;"><p style="font-size:12px;"><label style="display:inline"><input name="copilot_remember_credentials" type="checkbox"/> Let iTIC Copilot remember your credentials</label><br/><label style="display:inline"><input name="copilot_autologin" type="checkbox"/> Auto-login when a login page appears</label></p></div>');

    usr_input = $('#username');
    pwd_input = $('#password');
    log_button = $('input[type="submit"]');

    // Checking the 'stay logged in' by default
    $('input#autologin').prop('checked', true);

    copilot_remember = $('input[name="copilot_remember_credentials"]');
    copilot_autologin = $('input[name="copilot_autologin"]');

    itic_copilot.autologger(usr_input, pwd_input, log_button,
        copilot_remember, copilot_autologin, failed_login);
})();
