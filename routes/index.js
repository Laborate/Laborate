/* Modules: Custom */
var core = require('./core');
var auth = require('./auth');
var authUtil = require('./authUtil');
var account = require('./account');
var documents = require('./documents');
var editor = require('./editor');
var github = require('./github');
var bitbucket = require('./bitbucket');

module.exports = function(app) {
    /* Root */
    app.get('/', authUtil.loginCheck, auth.login);

    /* Login */
    app.get('/login', authUtil.loginCheck, auth.login);
    app.post('/auth/login', authUtil.login);

    /* Logout */
    app.get('/logout', authUtil.logout);

    /* Reload User Account */
    app.configure('development', function() {
        app.get('/reload', authUtil.reload);
    });

    /* Register */
    app.get('/register', authUtil.loginCheck, auth.register);
    app.post('/auth/register', authUtil.register);

    /* Verify Email */
    app.get('/verify', authUtil.restrictAccess, auth.verify);
    app.get('/verify/:code', authUtil.restrictAccess, authUtil.verify);

    /* Account */
    app.get("/account", authUtil.restrictAccess, core.update, account.index);
    app.get("/account/:panel", authUtil.restrictAccess, core.update, account.index);

    /* Documents */
    app.get('/documents', authUtil.restrictAccess, documents.index);
    app.get('/documents/files', authUtil.restrictAccess, authUtil.xhr, documents.files);
    app.get('/documents/locations', authUtil.restrictAccess, authUtil.xhr, documents.locations);
    app.get(/^\/documents\/([\w\d]{10})\/(.*?)/, authUtil.restrictAccess, documents.index);
    app.get(/^\/documents\/location\/([\w\d]{10})\/(.*)/, authUtil.restrictAccess, documents.location);
    app.post('/documents/file/create', authUtil.restrictAccess, authUtil.xhr, documents.file_create);
    app.post('/documents/file/upload', authUtil.restrictAccess, authUtil.xhr, documents.file_upload);
    app.post('/documents/file/:document/rename', authUtil.restrictAccess, authUtil.xhr, documents.file_rename);
    app.post('/documents/file/:document/remove', authUtil.restrictAccess, authUtil.xhr, documents.file_remove);
    app.post('/documents/location/create', authUtil.restrictAccess, authUtil.xhr, documents.create_location);
    app.post('/documents/location/remove', authUtil.restrictAccess, authUtil.xhr, documents.remove_location);

    /* Editor */
    app.get('/editor', authUtil.restrictAccess, editor.access_token, editor.index);
    app.get('/editor/:document', authUtil.restrictAccess, core.update, editor.access_token, editor.index);
    app.get('/editor/:document/download/:access_token', authUtil.restrictAccess, editor.access_token, editor.download);
    app.get('/editor/:document/download', authUtil.restrictAccess, editor.access_token, editor.download);
    app.post('/editor/exists', authUtil.restrictAccess, editor.access_token, editor.exists);
    app.post('/editor/:document/join', authUtil.restrictAccess, authUtil.xhr, editor.access_token, editor.join);
    app.post('/editor/:document/update', authUtil.restrictAccess, authUtil.xhr, editor.access_token, editor.update);
    app.post('/editor/:document/remove', authUtil.restrictAccess, authUtil.xhr, editor.access_token, editor.remove);
    app.post('/editor/:document/commit', authUtil.restrictAccess, authUtil.xhr, editor.access_token, github.commit);
    app.post('/editor/:document/invite', authUtil.restrictAccess, authUtil.xhr, editor.access_token, editor.invite);

    /* Github */
    app.get('/github/token', authUtil.restrictAccess, github.token);
    app.get('/github/token/add', authUtil.restrictAccess, github.add_token);
    app.get('/github/token/remove', authUtil.restrictAccess, github.remove_token);
    app.get('/github/repos', authUtil.restrictAccess, authUtil.xhr, github.repos);

    /* Bitbucket */
    app.get('/bitbucket/token', authUtil.restrictAccess, bitbucket.token);
    app.get('/bitbucket/token/add', authUtil.restrictAccess, bitbucket.add_token);
    app.get('/bitbucket/token/remove', authUtil.restrictAccess, bitbucket.remove_token);
    app.get('/bitbucket/repos', authUtil.restrictAccess, authUtil.xhr, bitbucket.repos);

    /* Not Found Page */
    app.all('*', function(req, res, next) {
        res.error(404);
    });
}
