module.exports = function(app, routes) {
    var auth = routes.auth;
    var core = routes.core;
    var documents = routes.documents;
    var editor = routes.editor;

    app.get('/editor', auth.util.restrictAccess, editor.index);
    app.get('/editor/:document', core.reload, documents.stats, editor.editor);
    app.get('/editor/:document/embed', editor.embed);

    if(!config.general.production) {
        app.get('/editor/:document/embed/tester', editor.embed_test);
    }

    app.get('/editor/:document/download', auth.util.restrictAccess, editor.download);
    app.get('/editor/:document/permissions', auth.util.restrictAccess, auth.util.xhr, editor.permissions);
    app.post('/editor/exists', auth.util.restrictAccess,  editor.exists);
    app.post('/editor/:document/update', auth.util.restrictAccess, auth.util.xhr, documents.stats, editor.update);
    app.post('/editor/:document/remove', auth.util.restrictAccess, auth.util.xhr, editor.remove);
    app.post('/editor/:document/commit', auth.util.restrictAccess, auth.util.xhr, editor.commit);
    app.post('/editor/:document/save', auth.util.restrictAccess, auth.util.xhr, editor.save);
    app.post('/editor/:document/invite', auth.util.restrictAccess, auth.util.xhr, editor.invite);
    app.post('/editor/:document/laborators', auth.util.restrictAccess, auth.util.xhr, editor.laborators);
    app.post('/editor/:document/laborator/:user', auth.util.restrictAccess, auth.util.xhr, editor.laborator);
}
