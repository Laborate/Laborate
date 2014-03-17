var fs = require('node-fs');
var rand = require("generate-key");

module.exports = function(root_dir) {
    var config_tmp = {};
    var keep_fields = [
        "forever", "sentry", "cookies:rememberme", "apps",
        "orm:protocol", "orm:port", "orm:host", "icons",
        "email", "forever", "github:scope",
        "development:debugger", "google:verification",
        "general:subdomains", "general:company", "general:delimeter", "general:default",
        "general:description", "general:logo", "cron", "robots",
        "gravatar", "sitemap", "redis", "social", "feedback", "gravatar",
        "general:hiring", "admin", "descriptions", "explict"
    ];

    var preset_fields = {
        "general:ssl": false,
        "general:production": false,
        "general:host": "laborate.io",
        "general:security": "laborate.io",
        "general:backdrop": "blurry",
        "general:ports": {
            "http": 80,
            "https": 443
        },
        "stripe:reset": true,
        "orm:reset": true,
        "orm:sync": true,
        "orm:preload": false,
        "orm:debug": false
        "development:basicAuth": {
            "<username 1>": "<password>",
            "<username 2>": "<password>"
        },
        "cookies:session": {
            "key": "usrs",
            "secret": rand.generateKey(50)
        }
    }

    $.each(config, function(key, value) {
        if(keep_fields.indexOf(key) == -1) {
            if(typeof value == "object") {
                config_tmp[key] = {}

                $.each(value, function(inner_key, inner_value) {
                    var field = key + ":" + inner_key;
                    if(keep_fields.indexOf(field) == -1) {
                        if(field in preset_fields) {
                            config_tmp[key][inner_key] = preset_fields[field];
                        } else {
                            if(Array.isArray(inner_value)) {
                                config_tmp[key][inner_key] = [];
                            } else if(typeof inner_value == "object") {
                                config_tmp[key][inner_key] = {};
                            } else {
                                config_tmp[key][inner_key] = "";
                            }
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

    fs.writeFile(root_dir + "/config.tmp.json", JSON.stringify(config_tmp, null, 4));
}
