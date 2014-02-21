module.exports = function(app, routes) {
    var auth = routes.auth;
    var github = routes.external.github;
    var bitbucket = routes.external.bitbucket;
    var google = routes.external.google;

    /* Github */
    if(config.apps.github) {
        app.get('/github/token', auth.util.restrictAccess, github.token);
        app.get('/github/token/add', auth.util.restrictAccess, github.add_token);
        app.get('/github/token/remove', auth.util.restrictAccess, github.remove_token);
        app.get('/github/repos', auth.util.restrictAccess, auth.util.xhr, github.repos);
    }

    /* Bitbucket */
    if(config.apps.bitbucket) {
        app.get('/bitbucket/token', auth.util.restrictAccess, bitbucket.token);
        app.get('/bitbucket/token/add', auth.util.restrictAccess, bitbucket.add_token);
        app.get('/bitbucket/token/remove', auth.util.restrictAccess, bitbucket.remove_token);
        app.get('/bitbucket/repos', auth.util.restrictAccess, auth.util.xhr, bitbucket.repos);
    }

    /* Google Drive */
    if(config.apps.google) {
        app.get('/google/token/add', auth.util.restrictAccess, google.add_token);
        app.get('/google/token/remove', auth.util.restrictAccess, google.remove_token);
        app.get('/google/token/:name', auth.util.restrictAccess, google.token);
    }
}
