/* Global Variables */
GLOBAL.$ = require("jquery");
GLOBAL.config = require('../config');
GLOBAL.lib = require('../lib');

/* Prototype Extensions */
lib.core.extensions();

/* Exports */
module.exports = function(callback) {
    var _this = this;
    this.lib = lib;
    this.editorJsdom = this.lib.jsdom.editor;
    this.redisClient = this.lib.redis,
    this.lib.models(this, function() {
        callback();
    });
}

/* Error Handling */
process.on('uncaughtException', function(exception) {
    lib.error.capture(exception);
});
