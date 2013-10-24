/* Modules: NPM */
var OAuth = require('oauth').OAuth;
var oauth = new OAuth(
    "https://bitbucket.org/api/1.0/oauth/request_token/",
    "https://bitbucket.org/api/1.0/oauth/access_token/",
    config.bitbucket.id,
    config.bitbucket.secret,
    "1.0",
    config.general.server + "/bitbucket/token/add/",
    'HMAC-SHA1'
);

exports.url = function(callback) {
    oauth.getOAuthRequestToken(function(error, token, secret) {
        callback(error, oauth.signUrl("https://bitbucket.org/api/1.0/oauth/authenticate/",
                                        token, secret, "GET"), secret);
    });
}

exports.token = function(token, secret, verifier, callback) {
    oauth.getOAuthAccessToken(token, secret, verifier, function(error, token, secret) {
        callback(error, token);
    });
}
