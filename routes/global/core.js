var fs = require("fs");
var outdatedhtml = require('express-outdatedhtml');
var backdrop_themes = {};

exports.setup = function(req, res, next) {
    //Set Server Root For Non Express Calls
    req.session.server = req.protocol + "://" + req.host;
    req.verified = (req.host.split(".").slice(-2).join(".") == config.general.security);

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

exports.redirects = function(req, res, next) {
    if(req.subdomains.indexOf('www') === -1) {
        next();
    } else {
        res.redirect(req.protocol + "://" + req.host.split(".").slice(1).join(".") + req.path);
    }
}

exports.imports = function(req, res, next) {
    //Import Lib
    req.core = lib.core;
    req.bitbucket = lib.bitbucket;
    req.email = lib.email(req.session.server);
    req.email_test = lib.email_test(req.session.server);
    req.email_init = lib.email_init;
    req.github = lib.github;
    req.google = lib.google;
    req.jsdom = lib.jsdom;
    req.sftp = lib.sftp;
    req.stripe = lib.stripe;
    req.redis = lib.redis;
    req.redis_init = lib.redis_init;
    req.error = lib.error;
    req.geoip = lib.geoip;
    req.sitemap = lib.sitemap;
    req.location = lib.geoip(req.address.ip) || {
        city: null,
        region: null,
        country: null,
        ll: [null, null]
    };

    //Device Info
    var device = req.device.type.toLowerCase();
    req.mobile = ["phone", "tablet"].indexOf(device) != -1;
    req.robot = device == "bot";

    //Site Routes
    if(req.verified) {
        require("../site/routes")(function(routes) {
            req.routes = routes;
        });

    //Api Routes
    } else if(req.subdomains.indexOf("api") != -1) {
        require("../site/api")(function(routes) {
            req.routes = routes;
        });

    //Webhooks Routes
    } else if(req.subdomains.indexOf("webhook") != -1) {
        require("../site/webhooks")(function(routes) {
            req.routes = routes;
        });

    }

    //Tracking
    if(!req.robot && req.headers['user-agent']) {
        req.redis.get("tracking", function(error, data) {
            var user = req.session.user;
            var organization = req.session.organization.id;
            var tracking = (data) ? JSON.parse(data) : [];

            tracking.push({
                type: (req.mobile) ? "mobile" : ((req.xhr) ? "xhr" : "web"),
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

    //Backdrop
    if(!req.robot && !req.xhr && req.headers['user-agent']) {
        req.backdrop = function(theme) {
            if(!theme) {
                if(req.session.organization.theme) {
                    theme = req.session.organization.theme;
                } else if(req.location.city) {
                    theme = req.location.city.toLowerCase().replace(/ /g, '_');
                } else {
                    theme = config.general.backdrop;
                }
            }

            if($.isEmptyObject(backdrop_themes)) {
                var themes = __dirname + "/../../public/img/backgrounds/";

                $.each(fs.readdirSync(themes), function(index, theme) {
                    var theme_path = themes + "/" + theme;
                    var stats = fs.lstatSync(theme_path);

                    if(stats.isDirectory() || stats.isSymbolicLink()) {
                        var files = fs.readdirSync(theme_path);

                        if(!files.empty) {
                            backdrop_themes[theme] = files;
                        }
                    }
                });
            }

            if(theme in backdrop_themes) {
                var file = backdrop_themes[theme][Math.floor((Math.random() * backdrop_themes[theme].length))];
                return "background-image: url('/img/backgrounds/" + theme + "/" + file + "');".replace(/ /g, '');
            } else {
                return req.backdrop(config.general.backdrop);
            }
        }
    }

    //Import Models
    lib.models_express(req, res, next);
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
