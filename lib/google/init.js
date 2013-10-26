/* Modules: NPM */
var googleapis = require('googleapis')

exports.oauth = new googleapis.OAuth2Client(
    config.google.id,
    config.google.secret,
    config.general.server + "/google/token/add/"
);

exports.url = function(callback) {
    if(callback) callback(this.oauth.generateAuthUrl({
        approval_prompt: "force",
        access_type: "offline",
        scope: 'https://www.googleapis.com/auth/drive'
    }));
}

exports.token = function(code, callback) {
    this.oauth.getToken(code, function(error, tokens) {
        if(callback) callback(error, tokens.refresh_token);
    });
}

exports.refresh = function(code, callback) {
    this.oauth.refreshToken_(code, function(error, tokens) {
        if(callback) callback(error, tokens);
    });
}

exports.authorize = function(refresh_token, callback) {
    var _oauth = this.oauth;
    this.refresh_token(refresh_token, function(error, tokens) {
        _oauth.credentials = tokens;
        googleapis.discover('drive', 'v2').execute(function(error, client) {
            callback(error, client.drive, function(event, results) {
                event.withAuthClient(_oauth).execute(results || Function);
            });
        });
    });
}
