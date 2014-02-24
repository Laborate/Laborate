module.exports = function(app) {
    app.all('*', function(req, res, next) {
        res.error(404);
    });
}
