/* Modules: NPM */
var googleapis = require('googleapis')

exports.oauth = new googleapis.OAuth2Client(
    config.google.id,
    config.google.secret,
    config.general.server + "/google/token/add/"
);

exports.url = function(callback) {
    if(callback) callback(this.oauth.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/drive'
    }));
}

exports.token = function(code, callback) {
    this.oauth.getToken(code, function(error, tokens) {
        if(callback) callback(error, tokens.access_token);
    });
}
