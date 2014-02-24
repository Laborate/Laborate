module.exports = function(app, routes) {
    var auth = routes.auth;
    var home = routes.home;

    app.get('/', auth.util.removeRedirect, auth.util.loginCheck, home.index);
}
