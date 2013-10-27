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
        scope: 'https://www.googleapis.com/auth/drive.file'
    }));
}

exports.token = function(code, callback) {
    var _this = this;
    _this.oauth.getToken(code, function(error, tokens) {
        _this.authorize(tokens, function(error, client, execute) {
            execute(client.about.get(), function(error, results) {
                tokens.root = results.rootFolderId;
                if(callback) callback(error, tokens);
            });
        });
    });
}

exports.refresh = function(callback) {
    var _oauth = this.oauth;
    _oauth.refreshAccessToken(function() {
        if(callback) callback(_oauth.credentials.access_token);
    });
}

exports.authorize = function(tokens, callback) {
    var _oauth = this.oauth;
    _oauth.credentials = tokens;
    googleapis.discover('drive', 'v2').execute(function(error, client) {
        callback(error, client.drive, function(event, response) {
            event.withAuthClient(_oauth).execute(response || Function);
        });
    });
}
