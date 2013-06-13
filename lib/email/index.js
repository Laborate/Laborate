/* Modules: NPM */
var $ = require('jquery');
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

/* Modules: Custom */
var config = require('../../config');

var transport = nodemailer.createTransport(config.email.mode, {
    service: "Gmail",
    auth: config.email.auth
});

module.exports = function(email_template, data, callback) {
    emailTemplates(__dirname, function(error, template) {
        template(email_template, true, function(error, batch) {
            $.each(data.users, function(index, locals) {
                batch(locals, "templates", function(error, html, text) {
                    transport.sendMail({
                      from: data.from,
                      to: locals.email,
                      subject: data.subject,
                      html: html,
                      text: text
                    }, function(error, results) {
                        if(callback) callback(error, results);
                    });
                });
            });
        });
    });
}
