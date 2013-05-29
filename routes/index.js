/* Modules: Custom */
var core = require('./core');
var auth = require('./auth');
var account = require('./account');
var documents = require('./documents');
var editor = require('./editor');
var github = require('./github');

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

    /* Documents */
    app.get('/documents', auth.restrictAccess, documents.index);
    app.get('/documents/locations', auth.restrictAccess, documents.locations);
    app.post('/documents/location/create', auth.restrictAccess, documents.create_location);
    app.post('/documents/location/remove', auth.restrictAccess, documents.remove_location);

	/* Editor */
	app.get('/editor', auth.restrictAccess, editor.index);

    /* Github */
    app.get('/github/token/add', auth.restrictAccess, github.add_token);
    app.get('/github/token/remove', auth.restrictAccess, github.remove_token);
    app.get('/github/repos', auth.restrictAccess, github.user_repos);
    app.get(/^\/github\/(.*)\/contents\/(.*)\/?/, auth.restrictAccess, github.repo_contents);
}