var fs = require("fs");
var async = require("async");
var outdatedhtml = require('express-outdatedhtml');
var backdrop_themes = {};

exports.setup = function(req, res, next) {
    //Set Server Root For Non Express Calls
    config.general.server = req.protocol + "://" + req.host;

    //Track Last HTML Page
    if(!req.xhr && !req.url.match(/^\/reload|^\/github|^\/bitbucket|^\/google/)) {
        req.session.last_page = req.url
    }

    //Header Config
    res.setHeader("Server", "Laborate.io");

    //Replace Views Elements For Compatibility With IE
    res.renderOutdated = function(view, data) {
        res.render(view, data, outdatedhtml.makeoutdated(req, res));
    }

    next();
}

exports.locals = function(req, res, next) {
    res.locals.csrf = req.session._csrf;
    res.locals.port = config.general.port;
    res.locals.production = config.general.production;
    res.locals.host = req.host;
    res.locals.site_title = config.general.company;
    res.locals.site_delimeter = config.general.delimeter.web;
    res.locals.description = config.general.description.join("");
    res.locals.sentry = config.sentry.browser;
    res.locals.google_verification = config.google.verification;
    res.locals.backdrop = "";
    res.locals.apps = {
        sftp: {
            show: false
        },
        github: {
            show: true,
            enabled: !!(req.session.user && req.session.user.github),
            link: "/github/token/"
        },
        bitbucket: {
            show: true,
            enabled: !!(req.session.user && req.session.user.bitbucket),
            link: "/bitbucket/token/"
        },
        dropbox: {
            show: false,
            enabled: false,
            link: "/dropbox/token/"
        },
        drive: {
            show: true,
            enabled: false,
            link: "/google/token/"
        }
    }

    next();
}

exports.device = function(req, res, next) {
    if(req.headers['user-agent'].toLowerCase().indexOf("msie") != -1) {
        res.error(200, "Internet Explorer browsers aren't supported yet. \
            Try <a class='backdrop-link' href='http://www.google.com/chrome'>Chrome</a>.", false);
    } else if(["desktop", "bot"].indexOf(req.device.type.toLowerCase()) != -1) {
        next();
    } else {
        req.device.type = req.device.type.charAt(0).toUpperCase() + req.device.type.slice(1);
        res.error(200, req.device.type + "'s aren't supported yet", false);
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

exports.backdrop = function(req, res, next) {
    req.backdrop = function(theme) {
        var files = backdrop_themes[theme];
        var style_css = "";

        if(!files) {
           var theme_path = __dirname + "/../public/img/backgrounds/" + theme;
            if(fs.lstatSync(theme_path).isDirectory()) {
                files = fs.readdirSync(theme_path);
                backdrop_themes[theme] = files;
            } else {
                return "";
            }
        }

        style_css = ("background-image: url('/img/backgrounds/" +
                    theme + "/" + files[Math.floor((Math.random() * files.length))] +
                    "');");

        if(theme == "blurry") {
            var hue = Math.floor((Math.random() * 360)) + "deg";
            style_css += ("filter: hue-rotate(" + hue + ");         \
                           -webkit-filter: hue-rotate(" + hue + "); \
                           -moz-filter: hue-rotate(" + hue + ");    \
                           -ms-filter: hue-rotate(" + hue + ");     \
                           -o-filter: hue-rotate(" + hue + ");      \
                          ");
        }

        return style_css.replace(/ /g, '');
    }

    next();
}
