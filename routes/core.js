var fs = require("fs");
var async = require("async");
var outdatedhtml = require('express-outdatedhtml');
var backdrop_themes = {};

exports.setup = function(req, res, next) {
    //Set Server Root For Non Express Calls
    if(!config.general.server) config.general.server = req.protocol + "://" + req.host;
    if(!config.random) config.random = Math.floor((Math.random()*1000000)+1);

    //Header Config
    res.setHeader("Server", "Laborate.io");

    //Replace Views Elements For Compatibility With IE
    res.renderOutdated = function(view, data) {
        res.render(view, data, outdatedhtml.makeoutdated(req, res));
    }

    next();
}

exports.locals = function(req, res, next) {
    res.locals.csrf = (req.csrfToken) ? req.csrfToken() : "";
    res.locals.port = config.general.port;
    res.locals.production = config.general.production;
    res.locals.host = config.general.server;
    res.locals.site_title = config.general.company;
    res.locals.site_delimeter = config.general.delimeter.web;
    res.locals.description = config.general.description.join("");
    res.locals.sentry = config.sentry.browser;
    res.locals.google_verification = config.google.verification;
    res.locals.logo = (req.session.organization) ? req.session.organization.logo : config.general.company;
    res.locals.backdrop = "";
    res.locals.private = false;
    res.locals.pageTrack = true;
    res.locals.config = {};
    res.locals.icons = config.icons;
    res.locals.user = req.session.user;
    res.locals.organization = req.session.organization;
    res.locals.gravatar = (req.session.user) ? ("https://www.gravatar.com/avatar/" + req.session.user.email_hash +
                          "?s=152&d=" + config.general.server + "%2Fimg%2Fdefault_gravatar.jpeg") : "/img/default_gravatar.jpeg";
    res.locals.apps = {
        sftp: {
            show: config.apps.sftp
        },
        github: {
            show: config.apps.github,
            enabled: !!(req.session.user && req.session.user.github),
            link: "/github/token/"
        },
        bitbucket: {
            show: config.apps.bitbucket,
            enabled: !$.isEmptyObject(req.session.user && req.session.user.bitbucket),
            link: "/bitbucket/token/"
        },
        dropbox: {
            show: config.apps.dropbox,
            enabled: false,
            link: "/dropbox/token/"
        },
        google: {
            show: config.apps.google,
            enabled: false,
            link: "/google/token/"
        }
    }

    next();
}

exports.device = function(req, res, next) {
    var device = req.device.type.toLowerCase();
    var user_agent = req.headers['user-agent'].toLowerCase();

    if(user_agent.indexOf("msie") != -1) {
        res.error(200, "Internet Explorer browsers aren't supported yet. \
            Try <a class='backdrop-link' href='http://www.google.com/chrome'>Chrome</a>.", null, false);
    } else if(["desktop", "bot"].indexOf(device) != -1 || user_agent == "ruby") {
        next();
    } else {
        device = device.charAt(0).toUpperCase() + device.slice(1);
        res.error(200, device + "'s aren't supported yet", null, false);
    }
}

exports.update = function(req, res, next) {
    async.series([
        function(callback) {
            req.models.users.get(req.session.user.id, function(error, user) {
                req.session.user = user;
                callback(error);
            });
        },
        function(callback) {
            req.models.documents.roles.find({
                user_id: req.session.user.id
            }, ["viewed", "Z"], function(error, roles) {
                if(!error) {
                    req.session.user.documents = {
                        total: roles.length,
                        private: $.map(roles, function(role) {
                            if(role.document.password) return true;
                        }).length,
                        top_viewed: $.map(roles.slice(0, 10), function(role) {
                            return role.document;
                        })
                    }
                } else {
                    req.session.user.documents = {
                        total: 0,
                        password: 0,
                        top_viewed: []
                    }
                }
                callback(error);
            });
        },
        function(callback) {
            req.session.save(callback);
        }
    ], next)
}

exports.backdrop = function(req, res, next) {
    req.backdrop = function(theme) {
        theme = (theme) ? theme : (req.session.organization) ? req.session.organization.theme : "blurry";
        var files = backdrop_themes[theme];
        var style_css = "";

        if(!files) {
           var theme_path = __dirname + "/../public/img/backgrounds/" + theme;
            if(fs.existsSync(theme_path) && fs.lstatSync(theme_path).isDirectory()) {
                files = fs.readdirSync(theme_path);

                if(files.length != 0) {
                    backdrop_themes[theme] = files;
                } else {
                    return req.backdrop("blurry");
                }
            } else {
                return req.backdrop("blurry");
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

exports.organization = function(req, res, next) {
    if(req.session.organization) {
        if(/^\/register\/.*/.exec(req.url) || /^\/verify\/.*/.exec(req.url)) {
            if(req.session.organization.register) {
                next();
            } else {
                res.error(404);
            }
        }
    } else {
        next();
    }
}
