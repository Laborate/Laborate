/* Global Variables */
GLOBAL.$ = require("jquery");
GLOBAL.config = require('../config');
GLOBAL.lib = require('../lib');

/* Prototype Extensions */
lib.core.extensions();

/* Exports */
module.exports = function(name, callback) {
    /* Setup */
    var _this = this;
    _this.redis = lib.redis();
    _this.finish = function() {
        setTimeout(function() {
            _this.redis.end();
            process.exit(code=0);
        }, 500);
    }
    lib.models_init(_this, callback);

    /* Exit After 1 Minute (Safegaurd) */
    setTimeout(function() {
        var message = "cronjob: " + name + " took longer than a minute";
        lib.error.report(message);
        _this.redis.end();
        process.exit(1);
    }, 60000);
}

/* Error Handling */
process.on('uncaughtException', function(exception) {
    lib.error.capture(exception);
});
