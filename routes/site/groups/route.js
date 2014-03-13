module.exports = function(app, routes) {
    var core = routes.core;
    var auth = routes.auth;
    var groups = routes.groups;

    app.get('/groups', auth.util.restrictAccess, groups.index);
    app.get('/groups/create', auth.util.restrictAccess, core.reload, groups.create);
    app.get('/groups/:group', auth.util.restrictAccess, core.reload, groups.group);

    app.post('/groups/create', auth.util.restrictAccess, groups.util.create);

    //app.get('/groups/:group/edit', auth.util.restrictAccess, core.reload, groups.edit);
    //app.get('/groups/:group/leave', auth.util.restrictAccess, core.reload, groups.leave);
    //app.get('/groups/:group/remove', auth.util.restrictAccess, core.reload, groups.remove);
    //app.get('/groups/:group/invite', auth.util.restrictAccess, core.reload, groups.invite);
    //app.get('/groups/:group/request/:user', auth.util.restrictAccess, core.reload, groups.request);
}
