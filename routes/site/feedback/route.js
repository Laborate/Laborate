module.exports = function(app, routes) {
    var auth = routes.auth;
    var core = routes.core;
    var feedback = routes.feedback;

    /* Feedback */
    if(config.feedback.enabled) {
        app.get('/feedback', auth.util.restrictAccess, core.reload, feedback.index);
        app.get('/feedback/success', auth.util.restrictAccess, core.reload, feedback.success);
        app.post('/feedback', auth.util.restrictAccess, core.reload, feedback.submit);
    }
}
