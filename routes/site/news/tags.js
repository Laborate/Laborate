exports.create = function(req, res, next) {
    req.models.posts.tags.findOrCreate(req.param("tag"), function(error, tag) {
        res.renderOutdated('news/filters/tag', {
            tag: tag
        });
    });
}
