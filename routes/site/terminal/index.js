exports.index = function(req, res, next) {
    res.renderOutdated('terminal/index', {
        title: "Terminals",
        page: "terminal",
        darken: true,
        locations: req.session.user.locations,
        js: clientJS.renderTags("terminal-lookup", "new-header"),
        css: clientCSS.renderTags("terminal-lookup", "new-header")
    });
}

exports.terminal = function(req, res, next) {
    var location = req.session.user.locations[req.param("location")];

    if(location && location.type == "sftp") {
        res.renderOutdated('terminal/terminal', {
            title: location.name + config.general.delimeter.web  + "Terminal",
            location: location,
            page: "terminal",
            js: clientJS.renderTags("terminal"),
            css: clientCSS.renderTags("terminal")
        });
    } else {
        res.error(404);
    }
}
