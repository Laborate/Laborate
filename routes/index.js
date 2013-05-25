var core = require('./core');
var auth = require('./auth');
var account = require('./account');
var documents = require('./documents');

module.exports = function(app){
    /* Root Route */
    app.get('/', auth.loginCheck, core.login);

    /* Login */
    app.get('/login', auth.loginCheck, core.login);
    app.post('/auth/login', auth.login);

    /* Register */
    app.get('/register', auth.loginCheck, core.register);
    app.post('/auth/register', auth.register);
    app.post('/auth/email_check', auth.emailCheck);

    /* Logout */
    app.get('/logout', auth.logout);

    /* Account */
    app.get('/account', auth.restrictAccess, account.index);
    app.get('/account/github_add_token', auth.restrictAccess, account.github_add_token);
    app.get('/account/github_remove_token', auth.restrictAccess, account.github_remove_token);

    /* Documents */
    app.get('/documents', auth.restrictAccess, documents.index);
}