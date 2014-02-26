module.exports = function(app, routes) {
    var auth = routes.auth;
    var news = routes.news;

    app.get('/news', auth.util.restrictAccess, news.index);
}
