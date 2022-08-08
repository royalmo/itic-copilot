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
    SYNC_SETTINGS_KEY = 'itic_copilot.sync_settings';
    DEFAULT_SETTINGS_PATH = browser.extension.getURL('/config/default_settings.json');

    USR_KEY = 'upcnet.username';
    PTP_KEY = 'upcnet.password'; // Virtual key (isn't in storage)
    ENC_KEY = 'upcnet.encrypted';
    AUTH_KEY= 'upcnet.authorisation';

    NO_SYNC_KEYS = [USR_KEY, ENC_KEY, AUTH_KEY];

    itic_copilot.settings = {};

    syncstorage = browser.storage.sync;
    localstorage = browser.storage.local;

    itic_copilot.settings.get = function (key) {
        if (NO_SYNC_KEYS.includes(key)) {
            return new Promise((resolve, reject) => {
                localstorage.get(key).then( (res) => {
                    if (key in res) {
                        resolve(res[key]);
                        return;
                    }

                    newdata = {[key] : null}
                    localstorage.set(newdata).then( () => {
                        resolve(null);
                    })
                });
            });
        }

        return new Promise((resolve, reject) => {
            syncstorage.get(SYNC_SETTINGS_KEY).then( (res) => {

                if (!(SYNC_SETTINGS_KEY in res)) {
                    // No settings found. Reset & sync storage.
                    itic_copilot.settings.reset().then( () => {
                        syncstorage.get(key).then( (res) => {
                            resolve(res[key]);
                        });
                    });
                    return;
                }

                // If the key we are looking for is sync settings,
                // we don't need to search for anything else.
                if (key==SYNC_SETTINGS_KEY) {
                    resolve(res[key]);
                    return;
                }

                // Determine the order to find the value
                storages = res[SYNC_SETTINGS_KEY] ?
                    [syncstorage, localstorage] : [localstorage, syncstorage];

                storages[0].get(key).then( (res)=> {
                    if(key in res) {
                        resolve(res[key]);
                        return;
                    }

                    // Look in other storage and if found, replace
                    storages[1].get(key).then( (res) => {
                        if(key in res) {
                            storages[0].set(res);
                            resolve(res[key]);
                            return;
                        }
    
                        // Look default value and replace
                        load_default_settings().then( (def_set) => {
                            data = { [key] : def_set[key] };
                            storages[0].set(data);
                            resolve(def_set[key]);
                        });
                    });
                });
            });
        });
    };

    itic_copilot.settings.getAll = function (include_passwod_placeholder=true) {
        return new Promise((resolve, reject) => {
            // we will scan for each setting individually
            // TODO: not efficient. Is it worth the time improving?
            load_default_settings().then( (def_set) => {
                final_settings = {};

                Object.keys(def_set).forEach( async (current) => {
                    final_settings[current] = await itic_copilot.settings.get(current);
                });

                if (include_passwod_placeholder && final_settings[USR_KEY]) {
                    final_settings[PTP_KEY] = "************";
                }
                resolve(final_settings);
            });
        });
    };

    // Get plain text password
    itic_copilot.settings.getPTP = function () {
        return new Promise((resolve, reject) => {
            itic_copilot.settings.get(ENC_KEY).then( (value) => {
                resolve(decrypt(value));
            });
        });
    }

    itic_copilot.settings.set = function (key, value) {
        if (key == PTP_KEY) {
            // If we save the password, we encrypt it first.
            value = encrypt(value);
            key = ENC_KEY;
        }

        data = {[key] : value};
        return new Promise((resolve, reject) => {
            // Sync settings are always stored in sync menu
            if (key == SYNC_SETTINGS_KEY) {
                syncstorage.set(data).then(resolve);
                return;
            }

            itic_copilot.settings.get(SYNC_SETTINGS_KEY).then( (sync) => {
                st = sync ? syncstorage : localstorage;
                st.set(data).then(resolve);
            });
        });
    };

    itic_copilot.settings.reset = function() {
        return new Promise((resolve, reject) => {
            localstorage.clear().then( () => {syncstorage.clear()} )
            .then(load_default_settings).then( (def_set) => {
                syncstorage.set(def_set).then(resolve);
            });
        });
    }

    default_settings_loaded = false;
    default_settings = null;
    function load_default_settings () {
        return new Promise((resolve, reject) => {
            if (default_settings_loaded) {
                resolve(default_settings);
                return;
            }

            $.getJSON(DEFAULT_SETTINGS_PATH, function(s) {
                default_settings_loaded = true;
                default_settings = s;
                resolve(default_settings);
            });
        });
    }

    // TODO
    function encrypt(value) {
        return value;
    }

    function decrypt(value) {
        return value;
    }
})();
