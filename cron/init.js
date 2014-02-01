/* Global Variables */
GLOBAL.$ = require("jquery");
GLOBAL.config = require('../config');
GLOBAL.lib = require('../lib');

/* Prototype Extensions */
lib.core.extensions();

/* Activate Emails */
lib.email_init();

/* Exports */
module.exports = function(name, callback) {
    /* Setup */
    var _this = this;
    _this.redis = lib.redis;
    _this.finish = function() {
        setTimeout(function() {
            _this.redis.end();
            process.exit(code=0);
        }, 500);
    }

    if(config.general.ssl) {
        var protocol = "https://";
    } else {
        var protocol = "http://";
    }

    if(config.general.production) {
        _this.email = lib.email(protocol + config.general.host);
    } else {
        _this.email = lib.email(protocol + config.profile.name + ".dev." + config.general.host);
    }

    lib.models_init(_this, callback);

    /* Exit After 2 Minutes (Safegaurd) */
    setTimeout(function() {
        lib.error.report("cronjob: " + name + " took longer than a 2 minutes", function() {
            _this.redis.end();
            process.exit(code=0);
        });
    }, 120000);
}

/* Error Handling */
process.on('uncaughtException', function(exception) {
    lib.error.capture(exception);
});
