module.exports = function(app, routes) {
    var auth = routes.auth;
    var welcome = routes.welcome;

    app.get('/welcome', auth.util.restrictAccess, welcome.index);
    app.get('/welcome/creative', auth.util.restrictAccess, welcome.creative);
    app.get('/welcome/social', auth.util.restrictAccess, welcome.social);
    app.get('/welcome/laborator', auth.util.restrictAccess, welcome.laborator);
    app.get('/welcome/gravatar', auth.util.restrictAccess, welcome.gravatar);
}
