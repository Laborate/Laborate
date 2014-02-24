module.exports = function(app, routes) {
    var auth = routes.auth;
    var core = routes.core;
    var terminal = routes.terminal;

    app.get('/terminals', auth.util.restrictAccess, core.reload, terminal.index);
    app.get('/terminals/:location', auth.util.restrictAccess, core.reload, terminal.terminal);
}
