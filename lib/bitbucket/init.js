/* Modules: NPM */
var OAuth = require('oauth').OAuth;
var BitBucket = require("bitbucket").BitBucket;

exports.oauth = function(server) {
    return new OAuth(
        "https://bitbucket.org/api/1.0/oauth/request_token/",
        "https://bitbucket.org/api/1.0/oauth/access_token/",
        config.bitbucket.id,
        config.bitbucket.secret,
        "1.0",
        server + "/bitbucket/token/add/",
        'HMAC-SHA1'
    );
}

exports.url = function(server, callback) {
    var oauth = this.oauth(server);
    oauth.getOAuthRequestToken(function(error, token, secret) {
        callback(error, oauth.signUrl("https://bitbucket.org/api/1.0/oauth/authenticate/",
                                        token, secret, "GET"), secret);
    });
}

exports.authorize = function(server, credentials, callback) {
    bitbucket = new BitBucket(false);
    bitbucket.authenticateOAuth(this.oauth(server), credentials.token, credentials.secret);
    callback(bitbucket);
}

exports.token = function(server, token, secret, verifier, callback) {
    this.oauth(server).getOAuthAccessToken(token, secret, verifier, function(error, token, secret) {
        callback(error, {
            token: token,
            secret: secret
        });
    });
}
