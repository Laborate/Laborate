exports.report = function(error) {
    try {
        if(typeof error == "object") {
            if(Array.isArray(error) && error.length != 0) {
                console.error(error);
                raven_client.captureError(error);
            } else if(!$.isEmptyObject(error)) {
                console.error(error);
                raven_client.captureError(error);
            }
        } else if(error) {
            console.error(error);
            raven_client.captureError(error);
        }
    } catch(error) {
        exports.report(error);
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
        exports.report(data);
    }

    if(typeof callback == "function") callback();
}
