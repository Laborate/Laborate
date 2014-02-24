module.exports = function(app) {
    require("./routes")(function(routes) {
        //Activate Routes
        $.each(routes, function(item, route) {
            if(route.route) {
                route.route(app, routes);
            }
        });
    });
}
