exports.index = function(req, res, next) {
    var locations = $.map(req.session.user.locations, function(location, index) {
        if(location.type == "sftp") {
            location.id = index;
            return location;
        }
    });

    if(locations.length != 1) {
        res.renderOutdated('terminal/index', {
            title: "Terminals",
            user: req.session.user,
            header: "terminal",
            header_darken: true,
            locations: locations,
            js: clientJS.renderTags("terminal-lookup", "new-header"),
            css: clientCSS.renderTags("terminal-lookup", "new-header"),
            backdrop: req.backdrop()
        });
    } else {
        res.redirect("/terminals/" + locations[0].id + "/");
    }
}

exports.terminal = function(req, res, next) {
    var location = req.session.user.locations[req.param("location")];

    if(location && location.type == "sftp") {
        res.renderOutdated('terminal/terminal', {
            title: location.name + config.general.delimeter.web  + "Terminal",
            user: req.session.user,
            location: location,
            header: "terminal",
            header_darken: true,
            js: clientJS.renderTags("terminal", "new-header"),
            css: clientCSS.renderTags("terminal", "new-header"),
            backdrop: req.backdrop()
        });
    } else {
        res.error(404);
    }
}

exports.embed = function(req, res, next) {
    var location = req.session.user.locations[req.param("location")];

    if(location && location.type == "sftp") {
        res.renderOutdated('terminal/embed', {
            title: location.name + config.general.delimeter.web  + "Terminal",
            user: req.session.user,
            location: location,
            js: clientJS.renderTags("terminal"),
            css: clientCSS.renderTags("terminal"),
            backdrop: req.backdrop()
        });
    } else {
        res.error(404);
    }
}
