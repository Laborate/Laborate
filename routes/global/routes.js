module.exports = function(req, res, next) {
    //Site Routes
    if(req.verified) {
        require("../site/routes")(function(routes) {
            req.routes = routes;
            next();
        });

    //Api Routes
    } else if(req.subdomains.indexOf("api") != -1) {
        require("../site/api")(function(routes) {
            req.routes = routes;
            next();
        });

    } else {
        next();
    }
}
