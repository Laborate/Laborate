module.exports = {
    core: require("./core"),
    bitbucket: require("./bitbucket"),
    email: require("./email"),
    github: require("./github"),
    google: require("./google"),
    jsdom: require("./jsdom"),
    redis: require('./redis'),
    models: require("./models"),
    sftp: require("./sftp"),
    stripe: require("./stripe"),
    express: function(req, res, next) {
        req.core = module.exports.core;
        req.bitbucket = module.exports.bitbucket;
        req.email = module.exports.email(req.host);
        req.github = module.exports.github;
        req.google = module.exports.google;
        req.jsdom = module.exports.jsdom;
        req.sftp = module.exports.sftp;
        req.stripe = module.exports.stripe();
        req.redis = module.exports.redis;
        module.exports.models(req, function() {
            next();
        });
    }
}
