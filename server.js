/* Modules: NPM */
var express    = require('express.io');
var slashes    = require("connect-slashes");
var piler      = require("piler");
var redis      = require('redis');
var ejs        = require('ejs');
var RedisStore = require('connect-redis')(express);
var raven      = require('raven');
var device     = require('express-device');

/* IMPORTANT - Global Variables */
GLOBAL.$              = require("jquery");
GLOBAL.config         = require('./config');
GLOBAL.lib            = require("./lib");
GLOBAL.clientJS       = piler.createJSManager({urlRoot: "/js/"});
GLOBAL.clientCSS      = piler.createCSSManager({urlRoot: "/css/"});
GLOBAL.raven_client   = new raven.Client(config.sentry.node);
GLOBAL.capture_error = function(data, callback) {
    /* True Means It Is On Init */
    if(data == true) {
        /* Return Blank Function */
        return function() {};
    } else {
        /*
            var data is now seen as
            error. Now check if it
            contains an error.
        */
        if(typeof data == "object") {
            if((Array.isArray(data) && data.length != 0) || !$.isEmptyObject(data)) {
                console.error(data);
                raven_client.captureError(data);
            }
        } else if(data) {
            console.error(data);
            raven_client.captureError(data);
        }
    }

    if(typeof callback == "function") callback();
}

/* Update Crontab */
require("./cron")(__dirname);

/* Update Config Template */
lib.core.config_template(__dirname);

/* Prototype Extensions */
lib.core.extensions();

/* Ejs Filters */
lib.core.ejs_filters(ejs);

/* Set App & Server Variables */
var app = express().http().io();
var srv = app.server;
var crsf = express.csrf();
var basic_auth = express.basicAuth;

/* Socket IO: Configuration */
app.io.configure(function() {
    app.io.enable('browser client minification');
    app.io.enable('browser client etag');
    app.io.enable('browser client gzip');
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
        redisPub: redis.createClient(),
        redisSub: redis.createClient(),
        redisClient: redis.createClient(),
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
    app.use('/favicon', express.static(__dirname + '/public/favicon'));
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
    app.use(express.cookieParser());
    app.use(express.session({
        key: config.cookie_session.key,
        secret: config.cookie_session.secret,
        store: new RedisStore({
            client: redis.createClient()
        })
    }));

    //Custom Setup
    app.use(require("./routes/core").setup);

    //Error Handler (Routes)
    app.use(require("./routes/error").handler);

    //Custom Backdrop
    app.use(require("./routes/core").backdrop);

    //Custom Libraries
    app.use(lib.express);

    //Custom Authentication
    app.use(require("./routes/security").core(crsf, basic_auth));

    //Custom Routing
    app.use(require("./routes/core").locals);
    app.use(require("./routes/core").device);
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
        console.error(exception);
        raven_client.captureError(exception);
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
app.listen(config.general.port);
