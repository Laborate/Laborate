var fs = require('node-fs');

module.exports = function(root_dir) {
    var config_tmp = {};
    var keep_fields = [
        "forever", "sentry", "cookies",
        "cookie_session:key", "apps", "icons",
        "orm:protocol", "orm:port", "orm:host",
        "orm:query", "email", "forever", "github:scope",
        "development:debugger", "google:verification",
        "general:port", "general:subdomains", "general:company",
        "general:delimeter", "general:description", "general:logo",
        "cron", "gravatar", "sitemap", "redis", "social",
        "feedback"
    ];

    var preset_fields = {
        "general:production": false,
        "general:host": "laborate.io",
        "stripe:reset": true,
        "orm:reset": true,
        "development:basicAuth": {
            "<username 1>": "<password>",
            "<username 2>": "<password>"
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
