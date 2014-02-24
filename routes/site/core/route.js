module.exports = function(app, routes) {
    var core = routes.core;

    app.get('/sitemap.xml', core.sitemap);
    app.get('/robots.txt', core.robots);
}
