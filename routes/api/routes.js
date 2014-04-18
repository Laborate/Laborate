var fs = require("fs");
var routes = {};

module.exports = function(callback) {
    if($.isEmptyObject(routes)) {
        async.each(fs.readdirSync(__dirname), function(directory, next) {
            var path = __dirname + "/" + directory;

            if(directory != "template" && fs.statSync(path).isDirectory()) {

                if(fs.existsSync(path + "/index.js")) {
                    routes[directory] = require(path);
                } else {
                    routes[directory] = {};
                }

                async.each(fs.readdirSync(path), function(file, next) {
                    if(file != "index.js" && fs.existsSync(path + "/" + file)) {
                        routes[directory][file.slice(0, -3)] = require(path + "/" + file);
                    }

                    next();
                }, next);

            } else {
                next();
            }

        }, function() {
            callback(routes);
        });

    } else {
        callback(routes);
    }
};
