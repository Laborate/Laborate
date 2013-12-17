/* Modules: NPM */
var googleapis = require('googleapis')

exports.oauth = function(server) {
    return new googleapis.OAuth2Client(
        config.google.id,
        config.google.secret,
        server + "/google/token/add/"
    );
}

exports.url = function(server, callback) {
    if(callback) callback(this.oauth(server).generateAuthUrl({
        approval_prompt: "force",
        access_type: "offline",
        scope: 'https://www.googleapis.com/auth/drive.file'
    }));
}

exports.token = function(server, code, callback) {
    var _this = this;
    _this.oauth(server).getToken(code, function(error, tokens) {
        _this.authorize(tokens, function(error, client, execute) {
            execute(client.about.get(), function(error, results) {
                if(!error) tokens.root = results.rootFolderId;
                if(callback) callback(error, tokens);
            });
        });
    });
}

exports.refresh = function(server, callback) {
    var _oauth = this.oauth(server);
    _oauth.refreshAccessToken(function() {
        if(callback) callback(_oauth.credentials.access_token);
    });
}

exports.authorize = function(server, tokens, callback) {
    var _oauth = this.oauth(server);
    _oauth.credentials = tokens;
    googleapis.discover('drive', 'v2').execute(function(error, client) {
        callback(error, client.drive, function(event, response) {
            event.withAuthClient(_oauth).execute(response || Function);
        });
    });
}
