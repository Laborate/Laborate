/* Modules: NPM */
var express    = require('express');
var app        = express();
var subdomains = require('express-subdomains');
var srv        = require('http').createServer(app).listen(3000);
var io         = require('socket.io').listen(srv);
var piler      = require("piler");
var clientJS   = piler.createJSManager({urlRoot: "/js/"});
var clientCSS  = piler.createCSSManager({urlRoot: "/css/"});

/* Modules: Custom */
var config = require('./config');

/* Express: Configuration */
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
});

/* Express: Development Only */
app.configure('development', function() {
    app.use(express.basicAuth(config.basicAuth.username, config.basicAuth.password));
});

/* Express: Production Only */
app.configure('production', function() {
    process.on('uncaughtException', function(err) {
      console.log("Uncaught Error: " + err);
      return false;
    });
});

/* Express: Start Router */
app.use(app.router);

/* Express: Import Routes */
require('./routes')(app);

/* Ejs: Import Filters */
require('./lib/ejs_filters')();

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
io.on('error', function(err) {
    console.log('Socket IO Error: ' + err.stack);
    require('socket.io').listen(8000);
    return false;
});

/* Socket IO: Import Routes */
require('./socket')(io);
