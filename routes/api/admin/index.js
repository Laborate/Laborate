var proccess = require('child_process');

exports.restart = function(req, res, next) {
    req.models.users.find({
        screen_name: req.param("user"),
        password: req.models.users.hash($.trim(req.param('password'))),
        admin: true
    }, function(error, users) {
        if(!error && !users.empty) {
            proccess.exec("forever restartall");

            res.json({
                success: true
            });
        } else {
            res.error(404, null, error);
        }
    });
}
