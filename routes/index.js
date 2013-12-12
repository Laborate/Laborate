/* Modules: Custom */
var core = require('./core');
var auth = require('./auth');
var authUtil = require('./authUtil');
var account = require('./account');
var documents = require('./documents');
var editor = require('./editor');
var github = require('./github');
var bitbucket = require('./bitbucket');
var google = require('./google');
var webhooks = require('./webhooks');
var email = require('./email');

module.exports = function(app) {
    /* Root */
    app.get('/', authUtil.loginCheck, auth.login);

    /* Login */
    app.get('/login', authUtil.loginCheck, auth.login);
    app.post('/auth/login', authUtil.login);

    /* Logout */
    app.get('/logout', authUtil.logout);

    /* Reload User Account */
    app.get('/reload', authUtil.reload);

    /* Register */
    app.get('/register', authUtil.loginCheck, core.organization, auth.register);
    app.post('/auth/register', core.organization, authUtil.register);

    /* Verify Email */
    app.get('/verify', authUtil.restrictAccess, core.organization, auth.verify);
    app.get('/verify/:code', authUtil.restrictAccess, core.organization, authUtil.verify);

    /* Reset Email */
    app.get('/reset', authUtil.loginCheck, core.organization, auth.reset);
    app.get('/reset/:code', authUtil.loginCheck, core.organization, auth.reset_password);
    app.post('/auth/reset', authUtil.loginCheck, core.organization, authUtil.reset);
    app.post('/auth/reset/:code', authUtil.loginCheck, core.organization, authUtil.reset_password);

    /* Account */
    app.get("/account", authUtil.restrictAccess, core.reload(true), account.index);
    app.get("/account/:panel", authUtil.restrictAccess, core.reload(true), account.index);
    app.post("/account/profile", authUtil.restrictAccess, authUtil.xhr, account.profile);
    app.post("/account/settings/password", authUtil.restrictAccess, authUtil.xhr, account.change_password);
    app.post("/account/settings/delete", authUtil.restrictAccess, authUtil.xhr, account.delete_account);
    app.post("/account/location/remove", authUtil.restrictAccess, authUtil.xhr, account.remove_location);
    app.post("/account/billing/card/add", authUtil.restrictAccess, authUtil.xhr, account.add_card);
    app.post("/account/billing/card/remove", authUtil.restrictAccess, authUtil.xhr, account.remove_card);
    app.post("/account/billing/plan", authUtil.restrictAccess, authUtil.xhr, account.plan_change);
    app.post("/account/notifications/hide", authUtil.restrictAccess, authUtil.xhr, account.notification_hide);
    app.post("/account/notifications/remove", authUtil.restrictAccess, authUtil.xhr, account.notification_remove);

    /* Documents */
    app.get('/documents', authUtil.restrictAccess, documents.index);
    app.get('/documents/files', authUtil.restrictAccess, authUtil.xhr, documents.files);
    app.get('/documents/locations', authUtil.restrictAccess, authUtil.xhr, core.reload(false), documents.locations);
    app.get(/^\/documents\/location\/([\w\d]*?)\/(.*)/, authUtil.restrictAccess, core.reload(false), documents.location);
    app.get(/^\/documents\/([\w\d]*?)\/(.*?)/, authUtil.restrictAccess, documents.index);
    app.post('/documents/file/create', authUtil.restrictAccess, authUtil.xhr, documents.file_create);
    app.post('/documents/file/upload', authUtil.restrictAccess, authUtil.xhr, documents.file_upload);
    app.post('/documents/file/:document/rename', authUtil.restrictAccess, authUtil.xhr, documents.file_rename);
    app.post('/documents/file/:document/remove', authUtil.restrictAccess, authUtil.xhr, documents.file_remove);
    app.post('/documents/location/create', authUtil.restrictAccess, authUtil.xhr, documents.create_location);

    /* Editor */
    app.get('/editor', authUtil.restrictAccess, editor.access_token, editor.index);
    app.get('/editor/:document', authUtil.restrictAccess, core.reload(true), editor.access_token, editor.index);
    app.get('/editor/:document/download/:access_token', authUtil.restrictAccess, editor.access_token, editor.download);
    app.get('/editor/:document/download', authUtil.restrictAccess, editor.access_token, editor.download);
    app.post('/editor/exists', authUtil.restrictAccess, editor.access_token, editor.exists);
    app.post('/editor/:document/join', authUtil.restrictAccess, authUtil.xhr, editor.access_token, editor.join);
    app.post('/editor/:document/update', authUtil.restrictAccess, authUtil.xhr, editor.access_token, editor.update);
    app.post('/editor/:document/remove', authUtil.restrictAccess, authUtil.xhr, editor.access_token, editor.remove);
    app.post('/editor/:document/commit', authUtil.restrictAccess, authUtil.xhr, editor.access_token, github.commit);
    app.post('/editor/:document/invite', authUtil.restrictAccess, authUtil.xhr, editor.access_token, editor.invite);

    /* Webhooks */
    app.post("/webhook/stripe", authUtil.loginDenied, webhooks.stripe);

    /* Github */
    if(config.apps.github) {
        app.get('/github/token', authUtil.restrictAccess, github.token);
        app.get('/github/token/add', authUtil.restrictAccess, github.add_token);
        app.get('/github/token/remove', authUtil.restrictAccess, github.remove_token);
        app.get('/github/repos', authUtil.restrictAccess, authUtil.xhr, github.repos);
    }

    /* Bitbucket */
    if(config.apps.bitbucket) {
        app.get('/bitbucket/token', authUtil.restrictAccess, bitbucket.token);
        app.get('/bitbucket/token/add', authUtil.restrictAccess, bitbucket.add_token);
        app.get('/bitbucket/token/remove', authUtil.restrictAccess, bitbucket.remove_token);
        app.get('/bitbucket/repos', authUtil.restrictAccess, authUtil.xhr, bitbucket.repos);
    }

    /* Google Drive */
    if(config.apps.google) {
        app.get('/google/token/add', authUtil.restrictAccess, google.add_token);
        app.get('/google/token/remove', authUtil.restrictAccess, google.remove_token);
        app.get('/google/token/:name', authUtil.restrictAccess, google.token);
    }


    /* Test Emails */
    if(!config.general.production) {
        app.get(/^\/email\/(.*)\//, email.index);
    }

    /* Not Found Page */
    app.all('*', function(req, res, next) {
        res.error(404);
    });
}
