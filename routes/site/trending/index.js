exports.index = function(req, res, next) {
    req.models.documents.all({
        private: false
    }, {
        autoFetch: true,
        autoFetchLimit: 3
    }, 10, ["viewed", "Z"], function (error, documents) {
        if(!error) {
            res.renderOutdated('trending/index', {
                title: 'Trending',
                documents: documents,
                js: clientJS.renderTags("trending", "backdrop"),
                css: clientCSS.renderTags("trending", "backdrop"),
                backdrop: req.backdrop(),
                pageTrack: true
            });
        } else {
            res.error(404, null, error);
        }
    });
}

exports.redirect = function(req, res, next) {
    res.redirect("/trending/");
}
