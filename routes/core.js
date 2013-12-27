var fs = require("fs");
var async = require("async");
var outdatedhtml = require('express-outdatedhtml');
var backdrop_themes = {};

exports.setup = function(req, res, next) {
    //Set Server Root For Non Express Calls
    req.session.server = req.protocol + "://" + req.host;
    req.session.save();
    if(!config.random) config.random = Math.floor((Math.random()*1000000)+1);

    //Header Config
    res.setHeader("Server", config.general.company);

    //Replace Views Elements For Compatibility With IE
    res.renderOutdated = function(view, data) {
        res.render(view, data, outdatedhtml.makeoutdated(req, res));
    }

    if('x-forwarded-for' in req.headers) {
        req.address = {
            ip: req.headers['x-forwarded-for'],
            port: req.headers['x-forwarded-port']
        }
    } else {
        req.address = {
            ip: req.ip,
            port: config.general.port
        }
    }

    next();
}

exports.tracking = function(req, res, next) {
    req.redis.get("tracking", function(error, data) {
        var user = req.session.user;
        var organization = req.session.organization.id;
        var tracking = (data) ? JSON.parse(data) : [];

        tracking.push({
            type: "web",
            agent: req.headers['user-agent'],
            lat: req.location.ll[0],
            lon: req.location.ll[1],
            city: req.location.city,
            state: req.location.region,
            country: req.location.country,
            ip: req.address.ip,
            port: req.address.port,
            user_id: (user) ? user.id : null,
            organization_id: (organization) ? organization.id : null,
            url: req.protocol + "://" + req.get('host') + req.url
        });

        req.redis.set(
            "tracking",
            JSON.stringify(tracking),
            req.error.capture
        );
    });
    next();
}

exports.locals = function(req, res, next) {
    res.locals.csrf = (req.csrfToken) ? req.csrfToken() : "";
    res.locals.port = config.general.port;
    res.locals.production = config.general.production;
    res.locals.host = req.session.server;
    res.locals.site_title = req.session.organization.logo || config.general.company;
    res.locals.site_delimeter = config.general.delimeter.web;
    res.locals.description = config.general.description.join("");
    res.locals.sentry = config.sentry.browser;
    res.locals.google_verification = config.google.verification;
    res.locals.company = config.general.company;
    res.locals.logo = req.session.organization.logo || config.general.logo;
    res.locals.social = config.social;
    res.locals.backdrop = "";
    res.locals.private = false;
    res.locals.pageTrack = true;
    res.locals.config = {};
    res.locals.random = config.random;
    res.locals.icons = config.icons;
    res.locals.user = req.session.user;
    res.locals.organization = req.session.organization;
    res.locals.gravatar = (req.session.user) ? req.session.user.gravatar : config.gravatar;
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
    };
    res.locals.favicons = (!$.isEmptyObject(req.session.organization.icons)) ? req.session.organization.icons : {
        "ico": res.locals.host + "/favicon/icon.ico",
        "196": res.locals.host + "/favicon/196.png",
        "160": res.locals.host + "/favicon/160.png",
        "114": res.locals.host + "/favicon/114.png",
        "72": res.locals.host + "/favicon/72.png",
        "57": res.locals.host + "/favicon/57.png"
    };

    next();
}

exports.device = function(req, res, next) {
    var device = req.device.type.toLowerCase();
    var user_agent = req.headers['user-agent'].toLowerCase();

    if(user_agent.indexOf("msie") == -1 && (["desktop", "bot"].indexOf(device) != -1 || user_agent == "ruby")) {
        res.locals.mobile = false;
        next();
    } else {
        res.renderOutdated('landing/mobile', {
            title: null,
            mobile: true,
            js: clientJS.renderTags("landing"),
            css: clientCSS.renderTags("backdrop", "landing"),
            backdrop: req.backdrop(),
            pageTrack: false,
            config: {
                animate: false
            }
        });
    }
}

exports.reload = function(documents) {
    return function(req, res, next) {
        async.series([
            function(callback) {
                req.models.users.get(req.session.user.id, function(error, user) {
                    req.session.user = user;
                    callback(error);
                });
            },
            function(callback) {
                if(documents) {
                    async.parallel({
                        total: function(callback) {
                            req.models.documents.roles.count({
                                user_id: req.session.user.id
                            }, function(error, count) {
                                callback(error, count);
                            });
                        },
                        private: function(callback) {
                            req.models.documents.count({
                                owner_id: req.session.user.id,
                                private: true
                            }, function(error, count) {
                                callback(error, count);
                            });
                        },
                        top_viewed: function(callback) {
                            req.models.documents.roles.find({
                                user_id: req.session.user.id
                            }, ["viewed", "Z"], 10, function(error, roles) {
                                callback(error, $.map(roles, function(role) {
                                    return role.document;
                                }));
                            });
                        }
                    }, function(errors, documents) {
                        if(!errors) {
                            req.session.user.documents = documents;
                        } else {
                            req.session.user.documents = {
                                total: 0,
                                password: 0,
                                top_viewed: []
                            }
                        }
                        callback(errors);
                    });
                } else {
                    callback(null);
                }
            },
            function(callback) {
                req.session.save();
                callback(null);
            }
        ], next);
    }
}

exports.backdrop = function(req, res, next) {
    req.backdrop = function(theme) {
        theme = theme || (req.session.organization.theme || config.general.backdrop);
        var files = backdrop_themes[theme];
        var style_css = "";

        if(!files) {
           var theme_path = __dirname + "/../public/img/backgrounds/" + theme;
            if(fs.existsSync(theme_path) && fs.lstatSync(theme_path).isDirectory()) {
                files = fs.readdirSync(theme_path);

                if(files.length != 0) {
                    backdrop_themes[theme] = files;
                } else {
                    return req.backdrop(config.general.backdrop);
                }
            } else {
                return req.backdrop(config.general.backdrop);
            }
        }

        style_css = ("background-image: url('/img/backgrounds/" +
                    theme + "/" + files[Math.floor((Math.random() * files.length))] +
                    "');");

        if(["blurry", "grid"].indexOf(theme) != -1) {
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
        if(["register", "verify", "reset"].indexOf(req.url.split("/")[1]) != -1) {
            if(!req.session.organization.register) {
                res.error(404);
            } else {
                next();
            }
        } else {
            next();
        }
    } else {
        next();
    }
}

exports.sitemap = function(req, res, next) {
    req.sitemap(req, function(xml) {
        res.set('Content-Type', 'application/xml');
        res.send(xml);
    });
}
