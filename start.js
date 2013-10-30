var $ = require("jquery");
var fs = require('node-fs');
var config = require('./config');
var forever = require('forever-monitor');

//Update Crontab
require("./cron")();

//Create Logs Folder
fs.mkdirSync(__dirname + '/../logs/' + config.forever.uid, 0775, true);
fs.mkdirSync(__dirname + '/../logs/' + config.forever.uid, 0775, true);

//Configure Forever
var child = new (forever.Monitor)(__dirname + '/server.js', {
    uid: config.forever.uid,
    max: config.forever.max_failures,
    silent: config.forever.silent,

    spinSleepTime: 0,

    watch: config.forever.watch,
    watchDirectory: __dirname + "/" + config.forever.watch_directory,
    watchIgnoreDotFiles: config.forever.watch_ignore_dot,
    watchIgnorePatterns: $.map(config.forever.watch_ignore_patterns, function(value) {
        return __dirname + "/" + value;
    }),

    env: {
        'NODE_ENV': (config.general.production) ? "production" : "development"
    },

    outFile: __dirname + "/" + config.forever.output_log,
    errFile: __dirname + "/" + config.forever.error_log,

    killTree: false
});

//Start Forver
child.start();

//Update config tmp file
var config_tmp = {};
var keep_fields = [
    "forever", "general", "sentry",
    "cookies", "cookie_session:key",
    "orm:dialect", "orm:port", "orm:host",
    "email", "forever", "github:scope",
    "development:debugger"
];

$.each(config, function(key, value) {
    if(keep_fields.indexOf(key) == -1) {
        if(typeof value == "object") {
            config_tmp[key] = {}

            $.each(value, function(inner_key, inner_value) {
                if(keep_fields.indexOf(key + ":" + inner_key) == -1) {
                    if(Array.isArray(inner_value)) {
                        config_tmp[key][inner_key] = [];
                    } else if(typeof inner_value == "object") {
                        config_tmp[key][inner_key] = {};
                    } else {
                        config_tmp[key][inner_key] = "";
                    }
                } else {
                    config_tmp[key][inner_key] = inner_value;
                }
            });
        } else {
            config_tmp[key] = "";
        }
    } else {
        config_tmp[key] = value;
    }
});

fs.writeFile(__dirname + "/config.tmp.json", JSON.stringify(config_tmp, null, 4));
