module.exports = function(app, routes) {
    var auth = routes.auth;
    var users = routes.users;

    app.post('/users/', auth.util.restrictAccess, auth.util.xhr, users.index);
    app.get('/users/:user', auth.util.removeRedirect, users.user);
}
