/* Modules: NPM */
var express    = require('express');
var app        = express();
var subdomains = require('express-subdomains');
var srv        = require('http').createServer(app);
var io         = require('socket.io').listen(srv);
var piler      = require("piler");
var clientJS   = piler.createJSManager();
var clientCSS  = piler.createCSSManager();

/* Modules: Custom */
var core = require('./lib/core');
var routes = require('./routes');

/* Configuration */
app.configure(function() {
    clientJS.bind(app,srv);
    clientCSS.bind(app,srv);
    subdomains.use('api');
    app.engine('html', require('ejs').renderFile);
    app.set('root', __dirname + '/');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('clientJS', clientJS);
    app.set('clientCSS', clientCSS);
    app.use('/fonts', express.static(__dirname + '/public/fonts'));
    app.use('/flash', express.static(__dirname + '/public/flash'));
    app.use('/img', express.static(__dirname + '/public/img'));
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

/* Developement Only */
app.configure('development', function() {
  app.use(express.errorHandler());
});

/* Routes */
app.get('/', core.dependencies, routes.index);

srv.listen(3000);