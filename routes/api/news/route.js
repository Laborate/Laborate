module.exports = function(app, routes) {
    var news = routes.news;

    app.get('/news', news.index);
}
