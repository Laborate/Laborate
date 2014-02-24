module.exports = function(app, routes) {
    var admin = routes.admin;

    app.get('/api/admin/restart/:user/:password/', admin.restart);
}
