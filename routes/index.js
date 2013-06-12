/* Modules: Custom */
var core = require('./core');
var auth = require('./auth');
var error = require('./error');
var account = require('./account');
var documents = require('./documents');
var editor = require('./editor');
var github = require('./github');

module.exports = function(app) {
    /* Root */
    app.get('/', auth.loginCheck, core.login);

    /* Login */
    app.get('/login', auth.loginCheck, core.login);
    app.post('/auth/login', auth.login);

    /* Register */
    app.get('/register', auth.loginCheck, core.register);
    app.post('/auth/register', auth.register);

    /* Activate */
    app.get('/activate', auth.restrictAccess, core.activate);
    app.post('/activate/resend', auth.restrictAccess, core.activate_resend);
    app.post('/auth/activate', auth.restrictAccess, auth.activate);

    /* Logout */
    app.get('/logout', auth.logout);

    /* Account */
    app.get(/^\/account\/.*/, auth.restrictAccess, account.index);

    /* Documents */
    app.get('/documents', auth.restrictAccess, documents.index);
    app.get('/documents/files', auth.restrictAccess, documents.files);
    app.post(/^\/documents\/file\/create/, auth.restrictAccess, documents.file_create);
    app.post(/^\/documents\/file\/(\d*)\/rename/, auth.restrictAccess, documents.file_rename);
    app.post(/^\/documents\/file\/(\d*)\/remove/, auth.restrictAccess, documents.file_remove);
    app.get('/documents/locations', auth.restrictAccess, documents.locations);
    app.get(/^\/documents\/(\d*)\/(.*)/, auth.restrictAccess, documents.index);
    app.get(/^\/documents\/location\/(\d*)\/(.*)/, auth.restrictAccess, documents.location);
    app.post('/documents/location/create', auth.restrictAccess, documents.create_location);
    app.post('/documents/location/remove', auth.restrictAccess, documents.remove_location);

    /* Editor */
    app.get(/^\/editor\/(\d*)/, auth.restrictAccess, editor.index);

    /* Github */
    app.get('/github/token/add', auth.restrictAccess, github.add_token);
    app.get('/github/token/remove', auth.restrictAccess, github.remove_token);
    app.get('/github/repos', auth.restrictAccess, github.repos);

    /* Not Found Page */
    app.all('*', core.not_found);

    /* Error Handling */
    app.use(error.handler);
}
