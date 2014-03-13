exports.create = function(req, res, next) {
    if(req.param("name")) {
        req.models.users.groups.create({
            name: req.param("name"),
            description: req.param("description"),
            owner_id: req.session.user.id
        }, function(error, group) {
            if(!error && group) {
                res.json({
                    success: true,
                    group: group.pub_id
                });
            } else {
                res.error(200, "Failed To Create Group", error);
            }
        });
    } else {
        res.error(200, "Missing Information");
    }
}
