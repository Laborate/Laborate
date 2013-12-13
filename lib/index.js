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
        var host = req.protocol + "://" + req.host;
        req.core = module.exports.core;
        req.bitbucket = module.exports.bitbucket;
        req.email = module.exports.email(host);
        req.email_test = module.exports.email_test(host);
        req.email_init = module.exports.email_init;
        req.github = module.exports.github;
        req.google = module.exports.google;
        req.jsdom = module.exports.jsdom;
        req.sftp = module.exports.sftp;
        req.stripe = module.exports.stripe();
        req.redis = module.exports.redis;
        req.error = module.exports.error;
        module.exports.models(req, function() {
            next();
        });
    }
}
