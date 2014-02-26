module.exports = function(app, routes) {
    var news = routes.news;

    app.get('/api/news', news.index);
}
