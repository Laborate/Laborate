exports.index = function(req, res, next) {
    var location = req.session.user.locations[req.param("location")];

    if(location && location.type == "sftp") {
        res.renderOutdated('terminal/index', {
            title: location.name + config.general.delimeter.web  + "Terminal",
            location: location,
            js: clientJS.renderTags("terminal"),
            css: clientCSS.renderTags("terminal")
        });
    } else {
        res.error(404);
    }
}
