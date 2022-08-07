
(function () {
    SYNC_SETTINGS_KEY = 'itic_copilot.sync_settings';
    itic_copilot.settings = {};

    itic_copilot.settings.get = function (key) {
        return new Promise((resolve, reject) => {
            // TODO
            $.getJSON(browser.extension.getURL('/config/default_settings.json'), function(settings) {
                resolve(settings[key]);
            });
        });
    };

    itic_copilot.settings.getAll = function () {
        return new Promise((resolve, reject) => {
            // TODO
            // upcnet.password (just a placeholder) should be also returned
            $.getJSON(browser.extension.getURL('/config/default_settings.json'), function(settings) {
                resolve(settings);
            });
        });
    };

    itic_copilot.settings.set = function (key, value) {
        data = {[key] : value};
        return new Promise((resolve, reject) => {
            // Sync settings are always stored in sync menu
            if (key == SYNC_SETTINGS_KEY) {
                browser.storage.sync.set(data).then(resolve);
                return;
            }

            itic_copilot.settings.get(SYNC_SETTINGS_KEY).then( (sync) => {
                st = sync ? browser.storage.sync : browser.storage.local;
                st.set(data).then(resolve);
            });
        });
    };

    itic_copilot.settings.reset = function() {
        console.log('reset');
        return new Promise((resolve, reject) => {
            browser.storage.local.clear().then(browser.storage.sync.clear)
            .then(load_default_settings).then( (def_set) => {
                browser.storage.sync.set(def_set).then(resolve);
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

            $.getJSON(browser.extension.getURL('/config/default_settings.json'),
                function(s) {
                    default_settings_loaded = true;
                    default_settings = s;
                    resolve(default_settings);
                }
            );
        });
    }
})();
