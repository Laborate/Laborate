module.exports = function(app, routes) {
    var core = routes.core;
    var auth = routes.auth;
    var news = routes.news;

    app.get('/news', auth.util.removeRedirect, core.reload, news.index);
    app.get('/news/group/:group', auth.util.removeRedirect, core.reload, news.index);
    app.get('/news/tags/:tag', news.tags.posts);
    app.get('/news/pages/:page', auth.util.xhr, news.posts);
    app.get('/news/:post', news.post);
    app.get('/news/:post/share', auth.util.xhr, news.share);

    app.post('/news/preview', auth.util.restrictAccess, auth.util.xhr, news.preview);
    app.post('/news/create', auth.util.restrictAccess, auth.util.xhr, news.create);
    app.post('/news/tags/create', auth.util.xhr, news.tags.create);
    app.post('/news/:post/like', auth.util.restrictAccess, auth.util.xhr, news.like);
    app.post('/news/:parent/reply', auth.util.restrictAccess, auth.util.xhr, news.reply);
}
