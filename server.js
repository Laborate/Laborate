/* Modules: NPM */
var express    = require('express.io');
var slashes    = require("connect-slashes");
var piler      = require("piler");
var ejs        = require('ejs');
var RedisStore = require('connect-redis')(express);
var raven      = require('raven');
var device     = require('express-device');
var subdomains = require('express-subdomains');
var fs         = require('fs');
var cluster    = require('cluster');
var numCPUs    = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
} else {
    /* IMPORTANT - Global Variables */
    GLOBAL.$              = require("jquery");
    GLOBAL.async          = require("async");
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
            key: fs.readFileSync(__dirname + '/credentials/laborate.key').toString(),
            cert: fs.readFileSync(__dirname + '/credentials/laborate.crt').toString(),
            ca: fs.readFileSync(__dirname + '/credentials/gandi_standard.pem').toString()
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
        app.io.set('heartbeat timeout', 10);
        app.io.set('heartbeat interval', 4);
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

        //Send Error Logging To Sentry
        app.use(raven.middleware.express(config.sentry.node));

        //Custom Setup
        app.use(require("./routes/global").core.setup);

        //Redirects
        app.use(require("./routes/global").core.redirects);

        //Express Subdomains
        async.each(config.general.subdomains, function(subdomain, next) {
            if(subdomain != "") {
                subdomains.use(subdomain);
            }

            next();
        }, function() {
            app.use(subdomains.middleware);
        });

        //Import Libraries
        app.use(require("./routes/global").core.imports);

        //Error Handler (Routes)
        app.use(require("./routes/global").error.handler);

        //Custom Authentication
        app.use(require("./routes/global").security(crsf, express.basicAuth));

        //Custom Routing
        app.use(require("./routes/global").core.locals);
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
        process.on('uncaughtException', function(exception) {
            lib.error.capture(exception);
            return false;
        });
    });

    /* Express: Start Router */
    app.use(app.router);

    /* Error Handler (Express) */
    app.use(require("./routes/global").error.global);

    /* Express: Import Routes */
    require('./routes/api')(app);
    require('./routes/webhooks')(app);
    require('./routes/site')(app);
    require('./routes/notfound')(app);

    /* Socket IO: Import Routes */
    require('./sockets')(app);

    /* Listen To Server */
    if(config.general.ssl) {
        app.listen(config.general.ports.https);

        /* HTTP -> HTTPS Redirect */
        express().http().all('*', function(req, res) {
            res.redirect("https://" + req.host + req.url);
        }).listen(config.general.ports.http);
    } else {
        app.listen(config.general.ports.http);
    }
}
