/* Modules: NPM */
var express    = require('express.io');
var slashes    = require("connect-slashes");
var piler      = require("piler");
var redis      = require('redis');
var ejs        = require('ejs');
var RedisStore = require('connect-redis')(express);
var cluster    = require('cluster');
var raven      = require('raven');
var device     = require('express-device');

/* Modules: Custom */
var core = require("./routes/core");
var error = require("./routes/error");

/* IMPORTANT - No VAR Makes Variables Global */
$         = require("jquery");
config    = require('./config');
clientJS  = piler.createJSManager({urlRoot: "/js/"});
clientCSS = piler.createCSSManager({urlRoot: "/css/"});

//Configure Workers
workers = function() {
    var app = express().http().io();
    var srv = app.server;

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
        require("./lib/core/dependencies")();

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
        app.use(express.csrf());

        //Error Handlers
        app.use(error.global);
        app.use(error.handler);

        //Custom Backdrop
        app.use(core.backdrop);

        //Custom Routing Config
        app.use(core.config);
        app.use(core.device);

        //Custom Libraries
        app.use(require("./lib/models").express);
        app.use(require("./lib/email"));
        app.use(require("./lib/github"));
    });

    /* Development Only */
    app.configure('development', function() {
        clientJS.liveUpdate(clientCSS, app.io);

        require('express-debug')(app, {
            theme: __dirname + config.development.debugger.theme,
            panels: config.development.debugger.panels
        });

        if(Object.keys(config.development.basicAuth).length != 0) {
            app.use(express.basicAuth(function(username, password) {
                return(config.development.basicAuth[username] == password);
            }));
        }
    });

    app.configure('production', function() {
        //Send Error Logging To Sentry
        app.use(raven.middleware.express(config.sentry.node));
    });

    /* Express: Start Router */
    app.use(app.router);

    /* Express: Import Routes */
    require('./routes')(app);

    /* Socket IO: Import Routes */
    require('./sockets')(app);

    /* Ejs: Import Filters */
    require('./lib/core/ejs_filters')(ejs);

    /* Listen To Server */
    app.listen(config.general.port);
}

//Scale With Workers
//Start forking if you are the master.
if (cluster.isMaster && config.general.production) {
    for (var i = 0; i < require('os').cpus().length; i++) {
        cluster.fork();
    }
} else {
    workers();
}
