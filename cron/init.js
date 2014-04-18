/* Global Variables */
GLOBAL.$ = require("jquery");
GLOBAL.async = require("async");
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
    _this.finish = function(error) {
        //Give 60 Seconds To Finish
        setTimeout(function() {
            _this.redis.end();
            process.exit(code=0);
        }, 60000);

        //Capture Error
        lib.error.capture(error);
    }

    if(config.general.ssl) {
        var protocol = "https://";
    } else {
        var protocol = "http://";
    }

    _this.email = lib.email(protocol + config.general.host);
    lib.models_init(_this, callback);

    /* Exit After 10 Minutes (Safegaurd) */
    setTimeout(function() {
        lib.error.report("cronjob: " + name + " took longer than a 10 minutes", function() {
            _this.redis.end();
            process.exit(code=0);
        });
    }, 600000);
}

/* Error Handling */
process.on('uncaughtException', function(exception) {
    lib.error.capture(exception);
});
