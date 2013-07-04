/* Modules: NPM */
var $ = require('jquery');
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(config.email.mode, {
    service: "Gmail",
    auth: config.email.auth
});

module.exports = function(email_template, data, callback) {
    errors = []
    results = []
    emailTemplates(__dirname, function(error, template) {
        template(email_template, true, function(error, batch) {
            $.each(data.users, function(index, locals) {
                locals.host = data.host;
                batch(locals, "templates", function(error, html, text) {
                    transport.sendMail({
                      from: data.from,
                      to: locals.email,
                      subject: data.subject + config.general.site_delimeter + config.general.site_title,
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
