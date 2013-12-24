module.exports = {
    core: require("./core"),
    bitbucket: require("./bitbucket"),
    email: require("./email").email,
    email_test: require("./email").test,
    email_init: require("./email").init,
    models_init: require("./models"),
    stripe_init: require("./stripe").init,
    stripe: require("./stripe").stripe,
    github: require("./github"),
    google: require("./google"),
    jsdom: require("./jsdom"),
    redis: require('./redis'),
    sftp: require("./sftp"),
    geoip: require("./geoip"),
    error: require("./error"),
    init: function(data, callback) {
        var _this = module.exports;

        _this.models_init(null, function() {
            _this.core.config_template(data.root);
            _this.core.extensions();
            _this.core.ejs_filters(data.ejs);
            _this.email_init();
            _this.stripe_init();
            if(callback) callback();
        }, false, true);
    },
    express: function(req, res, next) {
        var _this = module.exports;
        var host = req.protocol + "://" + req.host;

        req.core = _this.core;
        req.bitbucket = _this.bitbucket;
        req.email = _this.email(host);
        req.email_test = _this.email_test(host);
        req.email_init = _this.email_init;
        req.github = _this.github;
        req.google = _this.google;
        req.jsdom = _this.jsdom;
        req.sftp = _this.sftp;
        req.stripe = _this.stripe;
        req.redis = _this.redis();
        req.error = _this.error;
        req.geoip = _this.geoip;
        req.location = _this.geoip(req.headers['x-forwarded-for']);
        req.sitemap = require("./sitemap");
        _this.models_init(req, next, false);
    }
}