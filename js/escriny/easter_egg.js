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
    if (! await itic_copilot.settings.get('itic_copilot.easter_eggs')) return;

    // Make thing draggable https://stackoverflow.com/a/16448981/9643618
    function handle_mousedown(e){

        window.my_dragging = {};
        my_dragging.pageX0 = e.pageX;
        my_dragging.pageY0 = e.pageY;
        my_dragging.elem = this;
        my_dragging.offset0 = $(this).offset();

        function handle_dragging(e){
            var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
            var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
            $(my_dragging.elem)
            .offset({top: top, left: left});
        }

        function handle_mouseup(e){
            $('body')
            .off('mousemove', handle_dragging)
            .off('mouseup', handle_mouseup);
        }

        $('body')
        .on('mouseup', handle_mouseup)
        .on('mousemove', handle_dragging);
    }

    $('.widget-box').mousedown(handle_mousedown);

})();