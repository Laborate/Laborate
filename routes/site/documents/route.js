module.exports = function(app, routes) {
    var auth = routes.auth;
    var core = routes.core;
    var documents = routes.documents;

    app.get('/documents', auth.util.restrictAccess, documents.index);
    app.get('/documents/files', auth.util.restrictAccess, auth.util.xhr, documents.files);
    app.get('/documents/locations', auth.util.restrictAccess, auth.util.xhr, core.reload, documents.locations);
    app.get(/^\/documents\/location\/([\w\d]*?)\/(.*)/, auth.util.restrictAccess, core.reload, documents.location);
    app.get(/^\/documents\/([\w\d]*?)\/(.*?)/, auth.util.restrictAccess, documents.index);
    app.post('/documents/file/create', auth.util.restrictAccess, auth.util.xhr, documents.file_create);
    app.post('/documents/file/upload', auth.util.restrictAccess, auth.util.xhr, documents.file_upload);
    app.post('/documents/file/:document/rename', auth.util.restrictAccess, auth.util.xhr, documents.file_rename);
    app.post('/documents/file/:document/private', auth.util.restrictAccess, auth.util.xhr, documents.stats, documents.file_private);
    app.post('/documents/file/:document/remove', auth.util.restrictAccess, auth.util.xhr, documents.file_remove);
    app.post('/documents/location/create', auth.util.restrictAccess, auth.util.xhr, documents.create_location);
}
