/* Modules: NPM */
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(config.email.mode, {
    service: "Gmail",
    auth: config.email.auth,
    secureConnection: true
});

module.exports = function(req, res, next) {
    req.email = function(email_template, data, callback) {
        var errors = [], results = [];
        emailTemplates(__dirname, function(error, template) {
            template(email_template, true, function(error, batch) {
                $.each(data.users, function(index, locals) {
                    locals.host = req.host;
                    locals.company = config.general.company;
                    batch(locals, "templates", function(error, html, text) {
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
                        }, function(error, result) {
                            if(error) errors.push(error);
                            results.push(result);

                            if(index == data.users.length-1) {
                                if(callback) callback(errors, results);

                            }
                        });
                    });
                })
            });
        });
    }
    next();
}
