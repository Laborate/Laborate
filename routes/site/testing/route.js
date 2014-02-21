module.exports = function(app, routes) {
    var testing = routes.testing;

    if(!config.general.production) {
        app.get(/^\/testing.email\/(.*)\//, testing.email);
    }
}
