var fs = require("fs");
var async = require("async");
var outdatedhtml = require('express-outdatedhtml');
var backdrop_themes = {};

exports.config = function(req, res, next) {
    //Header Config
    res.setHeader("Server", "Laborate.io");

    //Response Locals
    res.locals.csrf = req.session._csrf;
    res.locals.port = config.general.port;
    res.locals.environment = config.general.environment;
    res.locals.host = req.host;
    res.locals.site_title = config.general.product + config.general.delimeter.web + config.general.company;
    res.locals.site_delimeter = config.general.delimeter.web;
    res.locals.sentry = config.sentry.browser;
    res.locals.backdrop_img = "";

    //Replace Views Elements For Compatibility With IE
    res.renderOutdated = function(view, data) {
        res.render(view, data, outdatedhtml.makeoutdated(req, res));
    }

    next();
}

exports.device = function(req, res, next) {
    if(req.device.type == "desktop") {
        next();
    } else {
        req.device.type = req.device.type.charAt(0).toUpperCase() + req.device.type.slice(1);
        res.error(200, req.device.type + "'s aren't supported yet");
    }
}

exports.update = function(req, res, next) {
    async.series([
        function(callback) {
            req.models.documents.count({
                owner_id: req.session.user.id,
                password: req.db.tools.ne(null)
            }, function(error, count) {
                if(!error) {
                    req.session.user.pass_documents = count;
                } else {
                    req.session.user.pass_documents = null;
                }
                callback(error);
            });
        }
    ], next)
}

exports.backdrop_image = function(theme) {
    var files = backdrop_themes[theme];

    if(!files) {
       var theme_path = __dirname + "/../public/img/backgrounds/" + theme;
        if(fs.lstatSync(theme_path).isDirectory()) {
            files = fs.readdirSync(theme_path);
            backdrop_themes[theme] = files;
        } else {
            return "";
        }
    }

    return "/img/backgrounds/" + theme + "/" + files[Math.floor((Math.random() * files.length))];
}
