/* Modules: Custom */
var mysql = require('../lib/mysql');

/* Module Exports */
exports.login = function(req, res) {
    if(req.param('user_email') && req.param('user_password')) {
        req.session.id = "5";
        res.json({"success": true});
    } else {
        res.json({
            "success": false,
            "error_message": "Incorrect Email or Password"
        });
    }
};

exports.logout = function(req, res) {
    req.session = null;
    res.redirect('/');
};

exports.register = function(req, res) {
    req.session.id = "6";
    res.json({"success": true});
};

exports.emailCheck = function(req, res) {
    if(req.param('user_email') != "1") {
        res.json({"success": true});
    } else {
        res.json({
            "success": false,
            "error_message": "Email Already Exists"
        });
    }
};

exports.restrictAccess = function(req, res, next) {
    if(!req.session.id) {
        res.redirect('/login/');
    } else {
        next();
    }
};

exports.loginCheck = function(req, res, next) {
    if(req.session.id) {
        res.redirect('/documents/');
    } else {
        next();
    }
};