/* Modules: NPM */
var OAuth = require('oauth').OAuth;
var BitBucket = require("bitbucket").BitBucket;

exports.oauth = new OAuth(
    "https://bitbucket.org/api/1.0/oauth/request_token/",
    "https://bitbucket.org/api/1.0/oauth/access_token/",
    config.bitbucket.id,
    config.bitbucket.secret,
    "1.0",
    config.general.server + "/bitbucket/token/add/",
    'HMAC-SHA1'
);

exports.authorize = function(credentials, callback) {
    bitbucket = new BitBucket(false);
    bitbucket.authenticateOAuth(this.oauth, credentials.token, credentials.secret);
    callback(bitbucket);
}

exports.url = function(callback) {
    var oauth = this.oauth;
    oauth.getOAuthRequestToken(function(error, token, secret) {
        callback(error, oauth.signUrl("https://bitbucket.org/api/1.0/oauth/authenticate/",
                                        token, secret, "GET"), secret);
    });
}

exports.token = function(token, secret, verifier, callback) {
    this.oauth.getOAuthAccessToken(token, secret, verifier, function(error, token, secret) {
        callback(error, {
            token: token,
            secret: secret
        });
    });
}
