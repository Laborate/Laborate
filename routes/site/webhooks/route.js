module.exports = function(app, routes) {
    var auth = routes.auth;
    var webhooks = routes.webhooks;

    app.post("/webhook/stripe", auth.util.loginDenied, webhooks.stripe);
}
