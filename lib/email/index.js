/* Modules: NPM */
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');
var fs = require('fs');
var less = require('less');

var transport = nodemailer.createTransport(config.email.mode, {
    service: "Gmail",
    auth: config.email.auth,
    secureConnection: true
});

exports.init = function() {
    fs.readFile(__dirname + "/index.less", "utf-8", function read(error, data) {
        less.render(data, function(error, css) {
            $.each(fs.readdirSync(__dirname), function(key, file) {
                if(fs.statSync(__dirname + "/" + file).isDirectory()) {
                    fs.writeFile(__dirname + "/" + file + "/style.css", css, capture_error);
                }
            });
            capture_error(error);
        });
        capture_error(error);
    });
}

exports.email = function(host) {
    var _this = this;
    return function(email_template, data, callback) {
        var errors = [], results = [];
        emailTemplates(__dirname, function(error, template) {
            template(email_template, true, function(error, batch) {
                if(!error && batch) {
                    $.each(data.users, function(index, locals) {
                        locals.host = host;
                        locals.company = config.general.company;
                        locals.date = new Date();
                        locals.date_formatted = _this.core.days.format(locals.date);

                        batch(locals, "templates", function(error, html) {
                            transport.sendMail({
                                from: data.from,
                                replyTo: data.from,
                                to: locals.email,
                                subject: [
                                    data.subject,
                                    config.general.company
                                ].join(config.general.delimeter.email),
                                html: html,
                                generateTextFromHTML: true,
                                forceEmbeddedImages: true
                            }, function(error, result) {
                                if(error) errors.push(error);
                                results.push(result);

                                if(index == data.users.length-1) {
                                    if(callback) callback(errors, results);

                                }
                            });
                        });
                    });
                } else {
                    if(callback) {
                        callback(error);
                    } else {
                        capture_error(error);
                    }
                }
            });
        });
    }
}

exports.test = function(host) {
    var _this = this;
    return function(email_template, data, callback) {
        var errors = [], results = [];
        emailTemplates(__dirname, function(error, template) {
            template(email_template, true, function(error, batch) {
                if(!error && batch) {
                    data.host = host;
                    data.company = config.general.company;
                    data.date = new Date();
                    data.date_formatted = _this.core.days.format(data.date);
                    batch(data, "templates", function(error, html) {
                        callback(error, html);
                    });
                } else {
                    callback(error);
                }
            });
        });
    }
}
