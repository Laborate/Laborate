/* NPM Modules */
var raven = require('raven');
var winston = require('winston');

/* Global Variables */
GLOBAL.$ = require("jquery");
GLOBAL.config = require('../config');
GLOBAL.ravenClient = new raven.Client(config.sentry.node);
GLOBAL.logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
          handleExceptions: false,
          raw: true
        }),
        new (winston.transports.File)({ filename: config.cron, level: 'error' })
    ],
    exitOnError: true
});
GLOBAL.capture_error = function(data) {
    /* True Means It Is On Init */
    if(data == true) {
        /* Return Blank Function */
        return function() {};
    } else {
        /*
            var data is now seen as
            error. Now check if it
            contains an error.
        */
        if(data) {
            logger.log("error", data);
            ravenClient.captureError(data, "cron");
        }
    }
}

/* Exports */
module.exports = function(callback) {
    var _this = this;
    this.lib = require("../lib")
    this.editorJsdom = this.lib.jsdom.editor;
    this.redisClient = this.lib.redis,
    this.lib.models(this, function() {
        callback();
    });
}

/* Error Handling */
process.on('uncaughtException', function(exception) {
    ravenClient.captureError(exception, "cron");
});
