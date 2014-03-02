module.exports = function(app, routes) {
    var auth = routes.auth;
    var news = routes.news;

    app.get('/news', auth.util.restrictAccess, news.index);
    app.get('/news/pages/:page', auth.util.restrictAccess, news.posts);
    app.get('/news/:post', auth.util.restrictAccess, news.post);

    app.post('/news/preview', auth.util.restrictAccess, news.preview);
    app.post('/news/create', auth.util.restrictAccess, news.create);
    app.post('/news/tags/create', auth.util.restrictAccess, news.tags.create);
    app.post('/news/:post/like', auth.util.restrictAccess, news.like);
    app.post('/news/:parent/reply', auth.util.restrictAccess, news.reply);
}
