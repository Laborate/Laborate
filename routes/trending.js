var async = require('async');

exports.index = function(req, res, next) {
    req.models.documents.all({}, {
        autoFetch:true,
        autoFetchLimit: 3
    }, 10, ["viewed", "Z"], function (error, documents) {
        if(!error) {
            res.renderOutdated('trending/index', {
                title: 'Trending',
                documents: documents,
                js: clientJS.renderTags("explore", "backdrop"),
                css: clientCSS.renderTags("explore", "backdrop"),
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
