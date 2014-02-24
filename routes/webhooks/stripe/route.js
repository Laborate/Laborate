module.exports = function(app, routes) {
    app.post("/webhook/stripe", routes.stripe);
}
