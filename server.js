/* Modules: Custom */
var config = require('./config');

/* Modules: NPM */
var express    = require('express');
var app        = express();
var srv        = require('http').createServer(app).listen(config.general.port);;
var io         = require('socket.io').listen(srv);
var slashes    = require("connect-slashes");
var piler      = require("piler");
var clientJS   = piler.createJSManager({urlRoot: "/js/"});
var clientCSS  = piler.createCSSManager({urlRoot: "/css/"});

/* Configuration */
app.configure(function() {
    clientJS.bind(app,srv);
    clientCSS.bind(app,srv);
    app.engine('html', require('ejs').renderFile);
    app.set('root', __dirname + '/');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('clientJS', clientJS);
    app.set('clientCSS', clientCSS);
    app.use('/favicon', express.static(__dirname + '/public/favicon'));
    app.use('/fonts', express.static(__dirname + '/public/fonts'));
    app.use('/flash', express.static(__dirname + '/public/flash'));
    app.use('/img', express.static(__dirname + '/public/img'));
    app.use(slashes(true));
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({
        key: config.cookie_session.key,
        secret: config.cookie_session.secret
    }));
    app.use(express.csrf());
    app.use(function(req, res, next) {
        res.locals.host = req.host;
        res.locals.site_title = config.general.site_title;
        res.locals.site_delimeter = config.general.site_delimeter;
        res.locals._csrf = req.session._csrf;
        res.setHeader("Server", "Laborate.io");
        res.removeHeader("X-Powered-By");
        next();
    });
});

/* Development Only */
app.configure('development', function() {
    app.use(express.basicAuth(config.basicAuth.username, config.basicAuth.password));
});

/* Production Only */
app.configure('production', function() {
    process.on('uncaughtException', function(error) {
      console.log("Uncaught Error: " + error.stack);
      return false;
    });
});

/* Express: Start Router */
app.use(app.router);

/* Express: Import Routes */
require('./routes')(app);

/* Ejs: Import Filters */
require('./lib/core/ejs_filters')();

/* Socket IO: Configuration */
io.configure(function(){
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.enable('browser client gzip');
    io.set('log level', 1);
    io.set('transports', [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);
    io.set('log colors', false);
});

/* Socket IO: Error Handling */
io.on('error', function(error) {
    console.log('Socket IO Error: ' + error.stack);
    require('socket.io').listen(srv);
    return false;
});

/* Socket IO: Import Routes */
require('./socket')(io);
