/* Modules: NPM */
var $ = require('jquery');
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(config.email.mode, {
    service: "Gmail",
    auth: config.email.auth
});

module.exports = function(email_template, data, callback) {
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
                    }, function(error, results) {
                        if(callback) callback(error, results);
                    });
                });
            });
        });
    });
}
