module.exports = function(app, routes) {
    var auth = routes.auth;
    var news = routes.news;

    app.get('/news', auth.util.restrictAccess, news.index);
    app.get('/news/post/:post', auth.util.restrictAccess, news.post);
    app.get('/news/posts/:page', auth.util.restrictAccess, news.posts);

    app.post('/news/post/preview', auth.util.restrictAccess, news.preview);
    app.post('/news/post/create', auth.util.restrictAccess, news.create);
}
