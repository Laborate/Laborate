var proccess = require('child_process');

exports.restart = function(req, res, next) {
    req.models.users.exists({
        screen_name: req.param("user"),
        password: req.models.users.hash($.trim(req.param('password'))),
        admin: true
    }, function(error, exists) {
        if(!error && exists) {
            proccess.exec("forever restartall");

            res.json({
                success: true
            });
        } else {
            res.error(404, null, error);
        }
    });
}
