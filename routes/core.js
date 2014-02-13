var fs = require("fs");
var async = require("async");
var outdatedhtml = require('express-outdatedhtml');
var backdrop_themes = {};

exports.setup = function(req, res, next) {
    //Set Server Root For Non Express Calls
    req.session.server = req.protocol + "://" + req.host;

    if(!config.general.production || !config.random) {
        config.random = Math.floor((Math.random()*1000000)+1);
    }

    //Header Config
    res.header("Server", config.general.company);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.host);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    //Replace Views Elements For Compatibility With IE
    res.renderOutdated = function(view, data) {
        if(req.mobile) {
            res.render('landing/mobile', {
                title: null,
                js: clientJS.renderTags("mobile"),
                css: clientCSS.renderTags("backdrop", "mobile"),
                backdrop: req.backdrop(),
                pageTrack: false,
                config: {
                    animate: false
                }
            }, outdatedhtml.makeoutdated(req, res));
        } else if(req.robot) {
            res.render("robot", data, outdatedhtml.makeoutdated(req, res));
        } else {
            res.render(view, data, outdatedhtml.makeoutdated(req, res));
        }
    }

    req.address = {
        ip: req.headers['x-forwarded-for'] || req.ip,
        port: req.headers['x-forwarded-port'] || function(ssl) {
            if(ssl) {
                return config.general.ports.https;
            } else {
                return config.general.ports.http;
            }
        }(config.general.ssl)
    }

    req.session.save();
    next();
}

exports.tracking = function(req, res, next) {
    if(!req.robot && req.headers['user-agent']) {
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
    }

    next();
}

exports.locals = function(req, res, next) {
    res.locals.csrf = (req.csrfToken) ? req.csrfToken() : "";
    res.locals.port = config.general.port;
    res.locals.production = config.general.production;
    res.locals.host = req.session.server;
    res.locals.socket = req.session.server;
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
    res.locals.icons = config.icons;
    res.locals.user = req.session.user;
    res.locals.organization = req.session.organization;
    res.locals.gravatar = (req.session.user) ? req.session.user.gravatar : config.gravatar;
    res.locals.mobile = req.mobile;
    res.locals.robot = req.robot;
    res.locals.title_first = true;
    res.locals.hiring = config.general.hiring;
    res.locals.random = "?rand=" + config.random;
    res.locals.embed = false;

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
        "196": res.locals.host + "/favicon/196.png",
        "160": res.locals.host + "/favicon/160.png",
        "114": res.locals.host + "/favicon/114.png",
        "72": res.locals.host + "/favicon/72.png",
        "57": res.locals.host + "/favicon/57.png",
        "32": res.locals.host + "/favicon/32.png"
    };

    next();
}

exports.device = function(req, res, next) {
    var device = req.device.type.toLowerCase();

    req.mobile = ["phone", "tablet"].indexOf(device) != -1;
    req.robot = device == "bot";

    next();
}

exports.redirects = function(req, res, next) {
    if(req.subdomains.indexOf('www') === -1) {
        next();
    } else {
        res.redirect(req.protocol + "://" + req.host.split(".").slice(1).join(".") + req.path);
    }
}

exports.reload = function(req, res, next) {
    if(req.session.user) {
        req.models.users.get(req.session.user.id, function(error, user) {
            req.session.user = user;
            req.session.save();
            lib.error.capture(error);
            next();
        });
    } else {
        next();
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

exports.robots = function(req, res, next) {
    res.set('Content-Type', 'text/plain');
    res.renderOutdated("robots", {
        disallow: config.robots
    });
}
