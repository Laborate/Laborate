var raven = require('raven');
var client = new raven.Client(config.sentry.node);

exports.report = function(error) {
    try {
        if(typeof error == "object") {
            if(Array.isArray(error) && !error.empty) {
                console.error(error);
                client.captureError(error);
            } else if(!$.isEmptyObject(error)) {
                console.error(error);
                client.captureError(error);
            }
        } else if(error) {
            console.error(error);
            client.captureError(error);
        }
    } catch(error) {
        return exports.report(error);
    }
}

exports.capture = function(data, callback) {
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
        if(typeof callback == "function") {
            exports.report(data);
            return callback();
        } else {
            return exports.report(data);
        }
    }
}
