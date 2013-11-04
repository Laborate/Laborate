/* NPM Modules */
var redis = require('redis');
var raven = require('raven');
var winston = require('winston');

/* Global Variables */
$ = require("jquery");
config = require('../config');
ravenClient = new raven.Client(config.sentry.node);
logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
          handleExceptions: false,
          raw: true
        }),
        new (winston.transports.File)({ filename: config.cron, level: 'error' })
    ],
    exitOnError: true
});
blank_function = function(data) {
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
    this.editorJsdom = require("../lib/jsdom/editor");
    this.redisClient = redis.createClient(),
    require("../lib/models").socket(function(response) {
        _this.models = response;
    });

    interval = setInterval(function() {
        if(_this.models) {
            clearInterval(interval);
            callback();
        }
    }, 10);
}

/* Error Handling */
process.on('uncaughtException', function(exception) {
    ravenClient.captureError(exception, "cron");
});
