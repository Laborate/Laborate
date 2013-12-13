module.exports = {
    core: require("./core"),
    bitbucket: require("./bitbucket"),
    email: require("./email").email,
    email_test: require("./email").test,
    email_init: require("./email").init,
    github: require("./github"),
    google: require("./google"),
    jsdom: require("./jsdom"),
    redis: require('./redis'),
    models: require("./models"),
    sftp: require("./sftp"),
    stripe: require("./stripe"),
    error: require("./error"),
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
        req.stripe = _this.stripe();
        req.redis = _this.redis;
        req.error = _this.error;
        _this.models(req, next, false);
    }
}
