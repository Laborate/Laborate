/* Global Variables */
GLOBAL.$ = require("jquery");
GLOBAL.config = require('../config');
GLOBAL.lib = require('../lib');

/* Prototype Extensions */
lib.core.extensions();

/* Exports */
module.exports = function(callback) {
    var _this = this;
    _this.lib = lib;
    _this.lib.models(_this, callback);
    _this.finish = function() {
        setTimeout(function() {
            _this.lib.redis.end();
            process.exit(code=0);
        }, 500);
    }
}

/* Error Handling */
process.on('uncaughtException', function(exception) {
    lib.error.capture(exception);
});
