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
    scroll_to_plan = window.location.href.endsWith('#plan');

    if (scroll_to_plan) {
        $(document).ready( function () {
            var select = $('a[href="#collapse-images-collapse-curriculum"]');

            $('#collapse-images-collapse-curriculum')
            .attr('style', '').attr('aria-expanded', 'true')
            .addClass('in');
            select.attr('aria-expanded', 'true').attr('class', '');

            var offTop = select.offset().top - 100;
            //$(document).scrollTop(offTop); does nothing in Chrome ...
            window.scrollTo({top: offTop, behavior: 'smooth'});
        });
    }
})();
