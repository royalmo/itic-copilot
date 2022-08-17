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
    if (! window.location.href.endsWith('&setup=true') ) return;
    
    $('td[align="right"]').children().attr('style', 'background:white;color:#bddbfa;');
    $('td[align="right"]').after('<td align="right"><input type="button" class="boto copilot_save_btn" value="' + t('schedule_picker_save_btn') + '"></td>');

    if ( window.location.href.endsWith('&show_alert=true&setup=true') ) {
        itic_copilot.fnon.alert(
            t('schedule_picker_setup_info'),
            t('schedule_picker_setup_title')
        );
    }

    $('.copilot_save_btn').click(function () {

        var subjects = [];

        $('input[type="checkbox"]:checked').each( (i, ch) => {
            full_code = $(ch).val();
            subj_code = full_code.split('_')[4];
            group = full_code.split('_')[8];

            // Example: ['330215', '8668__10949__330215__Q1__10', '10']
            subjects.push([subj_code, full_code, group]);
        });

        if (subjects.length == 0) return;

        itic_copilot.fnon.confirm(
            t('schedule_picker_confirm_title'),
            t('schedule_picker_confirm_text'),
            t('schedule_picker_yes'), t('ocw_downloader_cancel'),
            function (result) {
                if (!result) return;

                itic_copilot.settings.set('subjects', subjects);

                itic_copilot.fnon.alert(
                    t('schedule_picker_done_text'),
                    t('ocw_downloader_done'),
                    t('schedule_picker_see_schedule'),
                    autoremove=false
                );

                // Preventing schedule from opening in a new tab.
                $('#form_grups').removeAttr('target');
                $('button.f__btn').click(function () {
                    $('input[type="submit"]').first().click();
                });
            }
        );
    });
})();
