module.exports = function(app, routes) {
    var auth = routes.auth;
    var trending = routes.trending;

    app.get('/trending', auth.util.removeRedirect, trending.index);
    app.get('/explore', auth.util.removeRedirect, trending.redirect);
}
