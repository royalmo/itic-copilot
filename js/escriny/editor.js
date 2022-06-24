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

    // Example: https://escriny.epsem.upc.edu/svn/itic-copilot-test/bye.rst
    file_url = $('#repository-checkout-url').val();


    // Example: https://escriny.epsem.upc.edu/svn/itic-copilot-test
    repository_url = file_url.split('/', 5).join('/');

    // Looking for "Historial | Ver | Anotar | Descargar (| Editar) (X Bytes)" pattern.
    tmp = $('#content').children('p');
    for(i = 0; i<tmp.length; i++) {
        if (tmp.eq(i).text().split('|').length-1 === 3) {
            submenu_paragraph = tmp.eq(i);
            break;
        }
    }

    if (typeof submenu_paragraph === "undefined") return;

    startstr = submenu_paragraph.html();
    // Adding url to current view
    splitted = startstr.split('|')
    for(i = 0; i<splitted.length; i++) {
        console.log(splitted[i]);
        if(splitted[i].includes("</a>")) continue;
        
        word = splitted[i].replace(/\s+/g, '');
        splitted[i] = ' <i id="copilot_current_phar">' + word + '</i><a id="copilot_current_link" style="display:none;">' + word + '</a> ';
        break;
    }
    startstr = splitted.join('|');

    // Adding | Editar
    splitted = startstr.split('(');
    startstr = splitted[0] + '| <i id="copilot_edit_phar" style="display:none">Editar</i><a id="copilot_edit_link">Editar</a> (' + splitted[1];

    submenu_paragraph.html(startstr)

    original_content = $('#content').children().last();

    $(function () {
        $('#copilot_current_link').click(function () {
            $('#copilot_current_link').hide();
            $('#copilot_current_phar').show();
            $('#copilot_edit_link').show();
            $('#copilot_edit_phar').hide();

            original_content.show();
        });
        $('#copilot_edit_link').click(function () {
            $('#copilot_current_link').show();
            $('#copilot_current_phar').hide();
            $('#copilot_edit_link').hide();
            $('#copilot_edit_phar').show();

            original_content.hide();
        })
    })
})();