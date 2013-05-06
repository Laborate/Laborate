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
var config = require('./config');

/* Configuration */
app.configure(function() {
    clientJS.bind(app,srv);
    clientCSS.bind(app,srv);
    subdomains.use('api');
    app.engine('html', require('ejs').renderFile);
    app.set('site_title', config.general.site_title);
    app.set('site_delimeter', config.general.site_delimeter);
    app.set('root', __dirname + '/');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('clientJS', clientJS);
    app.set('clientCSS', clientCSS);
    app.use('/favicon', express.static(__dirname + '/public/favicon'));
    app.use('/fonts', express.static(__dirname + '/public/fonts'));
    app.use('/flash', express.static(__dirname + '/public/flash'));
    app.use('/img', express.static(__dirname + '/public/img'));
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({
        key: config.cookie_session.key,
        secret: config.cookie_session.secret
    }));
    app.use(app.router);
});

/* Development Only */
app.configure('development', function() {
    app.use(express.basicAuth(config.basicAuth.username, config.basicAuth.password));
})

/* Activate Routes */
require('./routes')(app);

srv.listen(3000);