/* Modules: Custom */
var core = require('./core');
var auth = require('./auth');
var error = require('./error');
var account = require('./account');
var documents = require('./documents');
var editor = require('./editor');
var github = require('./github');
var realtime = require('./realtime');

module.exports = function(app) {
    /* Root */
    app.get('/', auth.loginCheck, core.login);

    /* Login */
    app.get('/login', auth.loginCheck, core.login);
    app.post('/auth/login', auth.login);

    /* Register */
    app.get('/register', auth.loginCheck, core.register);
    app.post('/auth/register', auth.register);

    /* Verify Email */
    app.get('/verify', auth.restrictAccess, core.verify);
    app.get('/verify/:code', auth.restrictAccess, auth.verify);

    /* Logout */
    app.get('/logout', auth.logout);

    /* Account */
    app.get(/^\/account\/.*/, auth.restrictAccess, realtime.index, account.index);

    /* Documents */
    app.get('/documents', auth.restrictAccess, documents.index);
    app.get('/documents/files', auth.restrictAccess, auth.xhr, documents.files);
    app.get('/documents/locations', auth.restrictAccess, auth.xhr, documents.locations);
    app.get(/^\/documents\/([\w\d]{10})\/(.*)/, auth.restrictAccess, documents.index);
    app.get(/^\/documents\/location\/([\w\d]{10})\/(.*)/, auth.restrictAccess, documents.location);
    app.post(/^\/documents\/file\/create/, auth.restrictAccess, auth.xhr, documents.file_create);
    app.post(/^\/documents\/file\/(\d*)\/rename/, auth.restrictAccess, auth.xhr, documents.file_rename);
    app.post(/^\/documents\/file\/(\d*)\/remove/, auth.restrictAccess, auth.xhr, documents.file_remove);
    app.post('/documents/location/create', auth.restrictAccess, auth.xhr, documents.create_location);
    app.post('/documents/location/remove', auth.restrictAccess, auth.xhr, documents.remove_location);

    /* Editor */
    app.get('/editor', auth.restrictAccess, realtime.index, editor.index);
    app.get('/editor/:document', auth.restrictAccess, realtime.index, editor.index);
    app.get('/editor/:document/download', auth.restrictAccess, editor.download);
    app.post('/editor/:document/join', auth.restrictAccess, auth.xhr, editor.join);
    app.post('/editor/:document/update', auth.restrictAccess, auth.xhr, editor.update);
    app.post('/editor/:document/remove', auth.restrictAccess, auth.xhr, editor.remove);
    app.post('/editor/:document/commit', auth.restrictAccess, auth.xhr, github.commit);
    app.post('/editor/:document/invite', auth.restrictAccess, auth.xhr, editor.invite);

    /* Github */
    app.get('/github/token/add', auth.restrictAccess, github.add_token);
    app.get('/github/token/remove', auth.restrictAccess, github.remove_token);
    app.get('/github/repos', auth.restrictAccess, auth.xhr, github.repos);

    /* Not Found Page */
    app.all('*', core.not_found);

    /* Error Handling */
    app.use(error.handler);
}
