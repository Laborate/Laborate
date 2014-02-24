module.exports = {
    core: require("./core"),
    bitbucket: require("./bitbucket"),
    email: require("./email").email,
    email_test: require("./email").test,
    email_init: require("./email").init,
    models_init: require("./models").init,
    models_express: require("./models").express,
    stripe_init: require("./stripe").init,
    stripe: require("./stripe").stripe,
    github: require("./github"),
    google: require("./google"),
    jsdom: require("./jsdom"),
    redis_init: require('./redis'),
    redis: require('./redis')(),
    sftp: require("./sftp"),
    geoip: require("./geoip"),
    error: require("./error"),
    sitemap: require("./sitemap"),
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
    }
}
