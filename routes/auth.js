exports.login = function(req, res) {
    req.session.id = "5";
    res.json({"success": true});
};

exports.register = function(req, res) {
    req.session.id = "6";
    res.json({"success": true});
};

exports.email_check = function(req, res) {
    res.json({"success": true});
};