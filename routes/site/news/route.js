module.exports = function(app, routes) {
    var auth = routes.auth;
    var news = routes.news;

    app.get('/news', news.index);
    app.get('/news/pages/:page', news.posts);
    app.get('/news/:post', news.post);
    app.get('/news/tags/:tag', news.tags.posts);

    app.post('/news/preview', auth.util.restrictAccess, news.preview);
    app.post('/news/create', auth.util.restrictAccess, news.create);
    app.post('/news/tags/create', news.tags.create);
    app.post('/news/:post/like', auth.util.restrictAccess, news.like);
    app.post('/news/:parent/reply', auth.util.restrictAccess, news.reply);
}
