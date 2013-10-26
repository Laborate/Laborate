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
        if(callback) callback(error, tokens);
    });
}

exports.authorize = function(tokens, callback) {
    var _oauth = this.oauth;
    _oauth.credentials = tokens;
    googleapis.discover('drive', 'v2').execute(function(error, client) {
        callback(error, client.drive, function(event, response) {
            event.withAuthClient(_oauth).execute(function(error, results) {
                if(error) {
                    _oauth.refreshAccessToken(function() {
                        event.withAuthClient(_oauth).execute(response || Function);
                    });
                } else {
                    if(response) response(error, results);
                }
            });
        });
    });
}
