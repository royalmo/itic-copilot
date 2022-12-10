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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        if (request.contentScriptQuery == "SVNJSrequest") {
            SVNJSrequest(request.options, request.self)
            .then(response => response.text().then(
                text => {
                    var parsedResponse = {
                        status: response.status,
                        body: text,
                    };
                    sendResponse(parsedResponse);
                }))
            .catch(error => console.warn(error));
            return true;
        }
    }
);

function SVNJSrequest(options, self) {
    requestHeaders = new Headers();
    if (!options.noAuth)
        requestHeaders.append("Authorization", self.auth);

    if (options.headers) {
        for(var key in options.headers) {
            var val = options.headers[key];
            requestHeaders.append(key, val);
        }
    }

    return fetch(options.path, {
        credentials: 'omit',
        method: options.type,
        cache: 'no-cache',
        headers: requestHeaders,
        body: options.content
    });
}
