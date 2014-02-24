module.exports = function(app, routes) {
    var auth = routes.auth;
    var core = routes.core;
    var account = routes.account;
    var documents = routes.documents;

    app.get("/account", auth.util.restrictAccess, core.reload, documents.stats, account.index);
    app.get("/account/:panel", auth.util.restrictAccess, core.reload, documents.stats, account.index);
    app.post("/account/profile", auth.util.restrictAccess, auth.util.xhr, account.profile);
    app.post("/account/settings/password", auth.util.restrictAccess, auth.util.xhr, account.change_password);
    app.post("/account/settings/delete", auth.util.restrictAccess, auth.util.xhr, account.delete_account);
    app.post("/account/location/remove", auth.util.restrictAccess, auth.util.xhr, account.remove_location);
    app.post("/account/notifications/hide", auth.util.restrictAccess, auth.util.xhr, account.notification_hide);
    app.post("/account/notifications/remove", auth.util.restrictAccess, auth.util.xhr, account.notification_remove);

    /* Site is still in beta */
    if(!config.general.production) {
        app.post("/account/billing/card/add", auth.util.restrictAccess, auth.util.xhr, account.add_card);
        app.post("/account/billing/card/remove", auth.util.restrictAccess, auth.util.xhr, account.remove_card);
        app.post("/account/billing/plan", auth.util.restrictAccess, auth.util.xhr, account.plan_change);
    }
}
