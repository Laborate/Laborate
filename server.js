/* Modules: NPM */
var express    = require('express.io');
var slashes    = require("connect-slashes");
var piler      = require("piler");
var ejs        = require('ejs');
var RedisStore = require('connect-redis')(express);
var raven      = require('raven');
var device     = require('express-device');
var fs         = require('fs');

/* IMPORTANT - Global Variables */
GLOBAL.$              = require("jquery");
GLOBAL.config         = require('./config');
GLOBAL.lib            = require("./lib");
GLOBAL.clientJS       = piler.createJSManager({urlRoot: "/js/"});
GLOBAL.clientCSS      = piler.createCSSManager({urlRoot: "/css/"});

process.nextTick(function() {
    /* Install Crontab */
    require("./cron")(__dirname);

    /* Initialize Lib */
    lib.init({
        root: __dirname,
        ejs: ejs
    });
});

/* Set App & Server Variables */
if(config.general.ssl) {
    var app = express().https({
        key: fs.readFileSync('./laborate.key'),
        cert: fs.readFileSync('./laborate.crt')
    }).io();
} else {
    var app = express().http().io();
}

var srv = app.server;
var crsf = express.csrf();

/* Socket IO: Configuration */
app.io.configure(function() {
    app.io.enable('browser client minification');
    app.io.enable('browser client etag');
    app.io.enable('browser client gzip');
    app.io.set("origins", "*:*");
    app.io.set('log level', 1);
    app.io.set('log colors', true);
    app.io.set('transports', [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);

    app.io.set('store', new express.io.RedisStore({
        redisPub: lib.redis,
        redisSub: lib.redis,
        redisClient: lib.redis,
    }));
});

/* Express: Configuration */
app.configure(function() {
    //Assests
    clientJS.bind(app, srv);
    clientCSS.bind(app, srv);
    require("./public")(__dirname);

    //Express Engines
    app.engine('html', ejs.renderFile);

    //Express Global Config
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('view options', { layout: true });
    app.set('view cache', true);
    app.set('x-powered-by', false);

    //Express Direct Assests
    app.use('/favicon', express.static(__dirname + '/public/favicons'));
    app.use('/fonts', express.static(__dirname + '/public/fonts'));
    app.use('/flash', express.static(__dirname + '/public/flash'));
    app.use('/img', express.static(__dirname + '/public/img'));
    app.use('/codemirror', express.static(__dirname + '/node_modules/codemirror'));

    //Express Upload Limit
    app.use(express.limit('20mb'));

    //Express External Addons
    app.use(slashes(true));
    app.use(device.capture());

    //Express Logger & Cookie
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookies.session.secret));
    app.use(express.session({
        key: config.cookies.session.key,
        secret: config.cookies.session.secret,
        store: new RedisStore({
            client: lib.redis
        })
    }));

    //Custom Setup
    app.use(require("./routes/core").setup);

    //Custom Libraries
    app.use(lib.express);

    //Custom Backdrop
    app.use(require("./routes/core").backdrop);

    //Error Handler (Routes)
    app.use(require("./routes/error").handler);

    //Redirects
    app.use(require("./routes/core").redirects);

    //Device Check
    app.use(require("./routes/core").device);

    //Custom Authentication
    app.use(require("./routes/security").core(crsf, express.basicAuth));

    //Routes Tracking
    app.use(require("./routes/core").tracking);

    //Custom Routing
    app.use(require("./routes/core").locals);
});

/* Development Only */
app.configure('development', function() {
    require('express-debug')(app, {
        theme: __dirname + config.development.debugger.theme,
        panels: config.development.debugger.panels
    });
});

/* Production Only */
app.configure('production', function() {
    /* Last Resort Error Handling */
    process.on('uncaughtException', function (exception) {
        lib.error.capture(exception);
        return false;
    });
});

/* Express: Start Router */
app.use(app.router);

/* Send Error Logging To Sentry */
app.use(raven.middleware.express(config.sentry.node));

/* Error Handler (Express) */
app.use(require("./routes/error").global);

/* Express: Import Routes */
require('./routes')(app);

/* Socket IO: Import Routes */
require('./sockets')(app);

/* Listen To Server */
if(config.general.ssl) {
    app.listen(config.general.ports.https);
} else {
    app.listen(config.general.ports.http);
}
