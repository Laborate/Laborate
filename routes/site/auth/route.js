module.exports = function(app, routes) {
    var auth = routes.auth;
    var core = routes.core;

    /* Login */
    app.get('/login', auth.util.loginCheck, auth.login);
    app.get('/login/:user', auth.util.loginCheck, auth.login_user);
    app.post('/auth/login', auth.util.login);

    /* Logout */
    app.get('/logout', auth.util.logout);

    /* Reload User Account */
    app.get('/reload', auth.util.reload);

    /* Register */
    app.get('/register', auth.util.loginCheck, core.organization, auth.register);
    app.post('/register', auth.util.loginCheck, core.organization, auth.register);
    app.post('/auth/register', core.organization, auth.util.register);

    /* Verify Email */
    app.get('/verify', auth.util.restrictAccess, core.organization, auth.verify);
    app.get('/verify/resend', auth.util.restrictAccess, core.organization, auth.util.verifyResend);
    app.get('/verify/:code', auth.util.restrictAccess, core.organization, auth.util.verify);

    /* Reset Email */
    app.get('/reset', auth.util.loginCheck, core.organization, auth.reset);
    app.get('/reset/:code', auth.util.loginCheck, core.organization, auth.reset_password);
    app.post('/auth/reset', auth.util.loginCheck, core.organization, auth.util.reset);
    app.post('/auth/reset/:code', auth.util.loginCheck, core.organization, auth.util.reset_password);

    /* Refer */
    app.post('/refer', auth.util.restrictAccess, auth.util.refer);
}
