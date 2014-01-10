/* Modules: Custom */
var core = require('./core');
var landing = require('./landing');
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
var feedback = require('./feedback');
var admin = require('./admin');


module.exports = function(app) {
    /* Root */
    app.get('/', authUtil.loginCheck, landing.index);
    app.post('/register', authUtil.loginCheck, core.organization, auth.register);

    /* Login */
    app.get('/login', authUtil.loginCheck, auth.login);
    app.get('/login/:user', authUtil.loginCheck, auth.login_user);
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

    /* Feedback */
    if(config.feedback.enabled) {
        app.get('/feedback', authUtil.restrictAccess, core.reload, feedback.index);
        app.get('/feedback/success', authUtil.restrictAccess, core.reload, feedback.success);
        app.post('/feedback', authUtil.restrictAccess, core.reload, feedback.submit);
    }

    /* Account */
    app.get("/account", authUtil.restrictAccess, core.reload, documents.stats, account.index);
    app.get("/account/:panel", authUtil.restrictAccess, core.reload, documents.stats, account.index);
    app.post("/account/profile", authUtil.restrictAccess, authUtil.xhr, account.profile);
    app.post("/account/settings/password", authUtil.restrictAccess, authUtil.xhr, account.change_password);
    app.post("/account/settings/delete", authUtil.restrictAccess, authUtil.xhr, account.delete_account);
    app.post("/account/location/remove", authUtil.restrictAccess, authUtil.xhr, account.remove_location);
    app.post("/account/notifications/hide", authUtil.restrictAccess, authUtil.xhr, account.notification_hide);
    app.post("/account/notifications/remove", authUtil.restrictAccess, authUtil.xhr, account.notification_remove);

    /* Site is still in beta */
    if(!config.general.production) {
        app.post("/account/billing/card/add", authUtil.restrictAccess, authUtil.xhr, account.add_card);
        app.post("/account/billing/card/remove", authUtil.restrictAccess, authUtil.xhr, account.remove_card);
        app.post("/account/billing/plan", authUtil.restrictAccess, authUtil.xhr, account.plan_change);
    }

    /* Documents */
    app.get('/documents', authUtil.restrictAccess, documents.index);
    app.get('/documents/files', authUtil.restrictAccess, authUtil.xhr, documents.files);
    app.get('/documents/locations', authUtil.restrictAccess, authUtil.xhr, core.reload, documents.locations);
    app.get(/^\/documents\/location\/([\w\d]*?)\/(.*)/, authUtil.restrictAccess, core.reload, documents.location);
    app.get(/^\/documents\/([\w\d]*?)\/(.*?)/, authUtil.restrictAccess, documents.index);
    app.post('/documents/file/create', authUtil.restrictAccess, authUtil.xhr, documents.file_create);
    app.post('/documents/file/upload', authUtil.restrictAccess, authUtil.xhr, documents.file_upload);
    app.post('/documents/file/:document/rename', authUtil.restrictAccess, authUtil.xhr, documents.file_rename);
    app.post('/documents/file/:document/remove', authUtil.restrictAccess, authUtil.xhr, documents.file_remove);
    app.post('/documents/location/create', authUtil.restrictAccess, authUtil.xhr, documents.create_location);

    /* Editor */
    app.get('/editor', authUtil.restrictAccess, editor.index);
    app.get('/editor/:document', authUtil.restrictAccess, documents.stats, editor.editor);
    app.get('/editor/:document/download', authUtil.restrictAccess, editor.download);
    app.get('/editor/:document/permissions', authUtil.restrictAccess, authUtil.xhr, editor.permissions);
    app.post('/editor/exists', authUtil.restrictAccess,  editor.exists);
    app.post('/editor/:document/update', authUtil.restrictAccess, authUtil.xhr, editor.update);
    app.post('/editor/:document/remove', authUtil.restrictAccess, authUtil.xhr, editor.remove);
    app.post('/editor/:document/commit', authUtil.restrictAccess, authUtil.xhr, editor.commit);
    app.post('/editor/:document/invite', authUtil.restrictAccess, authUtil.xhr, editor.invite);
    app.post('/editor/:document/laborators', authUtil.restrictAccess, authUtil.xhr, editor.laborators);
    app.post('/editor/:document/laborator/:user', authUtil.restrictAccess, authUtil.xhr, editor.laborator);

    /* Admin */
    app.get('/admin', authUtil.restrictAccess, authUtil.admin, admin.index);
    app.get('/admin/:panel', authUtil.restrictAccess, authUtil.admin, admin.index);

    /* Webhooks */
    app.post("/webhook/stripe", authUtil.loginDenied, webhooks.stripe);

    /* SiteMap */
    app.get('/sitemap.xml', core.sitemap);

    /* Robots.txt */
    app.get('/robots.txt', core.robots);

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
