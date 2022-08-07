itic_copilot.settings = {
    get : function (key) {
        return new Promise((resolve, reject) => {
            // temporary
            $.getJSON(browser.extension.getURL('/config/default_settings.json'), function(settings) {
                resolve(settings[key]);
            });
        });
    },
    getAll : function () {
        return new Promise((resolve, reject) => {
            // temporary
            $.getJSON(browser.extension.getURL('/config/default_settings.json'), function(settings) {
                resolve(settings);
            });
        });
    },
    set : function (key, value) {
        return new Promise((resolve, reject) => {
            // temporary
            resolve();
        });
    },
    reset : function() {
        return new Promise((resolve, reject) => {
            // temporary
            resolve();
        });
    }
}