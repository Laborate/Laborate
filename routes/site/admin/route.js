module.exports = function(app, routes) {
    var auth = routes.auth;
    var admin = routes.admin;

    app.get('/admin', auth.util.restrictAccess, auth.util.admin, admin.index);
    app.get('/admin/:panel', auth.util.restrictAccess, auth.util.admin, admin.index);
}
