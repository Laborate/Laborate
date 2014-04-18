module.exports = function(app, routes) {
    var core = routes.core;

    app.get('/s/:code', core.shortner);
    app.get('/sitemap.xml', core.sitemap);
    app.get('/robots.txt', core.robots);
}
