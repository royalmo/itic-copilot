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
    const SYNC_SETTINGS_KEY = 'itic_copilot.sync_settings';
    const SAVE_CREDENTIALS_KEY = 'itic_copilot.save_upcnet_credentials';
    const DEFAULT_SETTINGS_PATH = browser.runtime.getURL('/config/default_settings.json');

    const USR_KEY = 'upcnet.username';
    const PTP_KEY = 'upcnet.password'; // Virtual key (isn't in storage)
    const ENC_KEY = 'upcnet.encrypted';

    const NO_SYNC_KEYS = [USR_KEY, ENC_KEY];

    itic_copilot.settings = {};

    const syncstorage = browser.storage.sync;
    const localstorage = browser.storage.local;

    itic_copilot.settings.get = function (key) {
        if (NO_SYNC_KEYS.includes(key)) {
            return new Promise((resolve, reject) => {
                localstorage.get(key).then( (res) => {
                    if (key in res) {
                        resolve(res[key]);
                        return;
                    }

                    var newdata = {[key] : null}
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
                var storages = res[SYNC_SETTINGS_KEY] ?
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
                            var data = { [key] : def_set[key] };
                            storages[0].set(data);
                            resolve(def_set[key]);
                        });
                    });
                });
            });
        });
    };

    itic_copilot.settings.getAll = function (include_PTP=true) {
        return new Promise((resolve, reject) => {
            Promise.all([
                load_default_settings(),
                localstorage.get(),
                syncstorage.get()
            ]).then(results => {
                // Removing possible false sync settings.
                NO_SYNC_KEYS.forEach(e => delete results[2][e]);

                // Swap storage order if sync is disabled.
                if ( (SYNC_SETTINGS_KEY in results[2]) && (! results[2][SYNC_SETTINGS_KEY]) ) {
                    [results[1], results[2]] = [results[2], results[1]];
                }

                // Merging settings
                var all_settings = { ...results[0], ...results[1], ...results[2] };

                // Removing credentials if user asked to not save them (should not be saved but well)
                if (!all_settings[SAVE_CREDENTIALS_KEY])
                    NO_SYNC_KEYS.forEach(e => delete all_settings[e]);

                if (include_PTP && all_settings[ENC_KEY]) {
                    all_settings[PTP_KEY] = decrypt(all_settings[ENC_KEY]);
                }

                resolve(all_settings);
            });
        });
    };

    // Get plain text password
    itic_copilot.settings.getPTP = function () {
        return new Promise((resolve, reject) => {
            itic_copilot.settings.get(ENC_KEY).then( (value) => {
                if (value)
                    resolve(decrypt(value));

                else // password is not set
                    resolve('');
            });
        });
    }

    itic_copilot.settings.set = function (key, value) {
        if (key == PTP_KEY) {
            // If we save the password, we encrypt it first.
            value = encrypt(value);
            key = ENC_KEY;
        }

        var data = {[key] : value};
        return new Promise((resolve, reject) => {
            // Sync settings are always stored in sync menu
            if (key == SYNC_SETTINGS_KEY) {
                itic_copilot.settings.get(SYNC_SETTINGS_KEY).then( sync => {
                    if (sync == value) return;

                    // If sync options have changed, we need to migrate options.
                    var storages = sync ?
                        [syncstorage, localstorage] : [localstorage, syncstorage];

                    // Delete storage-specific options
                    storages[0].get().then( res => {
                        [...NO_SYNC_KEYS, SYNC_SETTINGS_KEY].forEach(e => delete res[e]);
                        
                        storages[1].set(res).then(() => {
                            syncstorage.set(data).then(resolve);
                        });
                    });
                });
                return;
            }

            itic_copilot.settings.get(SYNC_SETTINGS_KEY).then( (sync) => {
                var st = (sync && !NO_SYNC_KEYS.includes(key)) ? syncstorage : localstorage;
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

    // We could think of a better encryptation (?)
    function encrypt(value) {
        return window.btoa(value);
    }

    function decrypt(value) {
        return window.atob(value);
    }
})();
