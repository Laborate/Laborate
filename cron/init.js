/* NPM Modules */
var redis = require('redis');
var raven = require('raven');
var winston = require('winston');

/* Global Variables */
config = require('../config');
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
            console.error(data);
            raven_client.captureError(data);
        }
    }
}


/* Exports */
module.exports = function(callback) {
    var _this = this;
    this.$ = require("jquery");
    this.editorJsdom = require("../lib/jsdom/editor");
    this.redisClient = redis.createClient(),
    this.raven_client = new raven.Client(config.sentry.node),
    this.logger = new (winston.Logger)({
        transports: [
            new winston.transports.Console({
              handleExceptions: true,
              json: true
            })
        ],
        exitOnError: true
    })

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
