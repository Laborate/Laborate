/* Modules: NPM */
var express = require('express.io');
var app     = express().http().io();
var srv     = require('http').createServer(app);
var slashes = require("connect-slashes");
var piler   = require("piler");
var redis   = require('redis');
var ejs     = require('ejs');

/* Modules: Custom */
var error = require("./routes/error");

/* IMPORTANT - No VAR Makes Variables Global */
config    = require('./config');
clientJS  = piler.createJSManager({urlRoot: "/js/"});
clientCSS = piler.createCSSManager({urlRoot: "/css/"});

/* Configuration */
app.configure(function() {
    //Assests
    clientJS.bind(app, srv);
    clientCSS.bind(app, srv);
    require("./lib/core/dependencies")();

    //Redis
    app.io.set('store', new express.io.RedisStore({
        redisPub: redis.createClient(),
        redisSub: redis.createClient(),
        redisClient: redis.createClient()
    }));

    //Express
    app.engine('html', ejs.renderFile);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('view options', { layout: true });
    app.set('view cache', true);
    app.set('x-powered-by', false);
    app.use('/favicon', express.static(__dirname + '/public/favicon'));
    app.use('/fonts', express.static(__dirname + '/public/fonts'));
    app.use('/flash', express.static(__dirname + '/public/flash'));
    app.use('/img', express.static(__dirname + '/public/img'));
    app.use('/codemirror', express.static(__dirname + '/node_modules/codemirror'));
    app.use(slashes(true));
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookie_session.secret));
    app.use(express.cookieSession({ key: config.cookie_session.key }));
    app.use(express.csrf());

    //Custom
    app.use(require("./lib/models"));
    app.use(require("./lib/email"));
    app.use(require("./lib/github"));
    app.use(error.global);
    app.use(error.handler);
    app.use(function(req, res, next) {
        res.locals.host = req.host;
        res.locals.site_title = config.general.site_title;
        res.locals.site_delimeter = config.general.site_delimeter;
        res.locals._csrf = req.session._csrf;
        res.setHeader("Server", "Laborate.io");
        next();
    });
});

/* Development Only */
app.configure('development', function() {
    require('express-debug')(app, {
        theme: __dirname + config.development.debugger.theme,
        panels: config.development.debugger.panels
    });

    if(config.development.basicAuth.username) {
        app.use(express.basicAuth(
            config.development.basicAuth.username,
            config.development.basicAuth.password
        ));
    }
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
require('./lib/core/ejs_filters')(ejs);

/* Socket IO: Configuration */
app.io.configure(function(){
    app.io.enable('browser client minification');
    app.io.enable('browser client etag');
    app.io.enable('browser client gzip');
    app.io.set('log level', 1);
    app.io.set('transports', [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);
    app.io.set('log colors', true);
});

/* Socket IO: Import Routes */
require('./sockets')(app);

/* Listen To Server */
app.listen(config.general.port);
