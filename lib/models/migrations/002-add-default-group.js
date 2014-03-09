exports.up = function(next){
    lib.models_init(null, function(db, models) {
        lib.core.extensions();

        models.users.all({}, { autoFetch: false }).only("id").run(function(error, users) {
            if(!error && !users.empty) {
                async.each(users, function(user, callback) {
                    user.getGroups(function(error, groups) {
                        if(!error && groups.empty) {
                            models.users.groups.create({
                                name: "Friends",
                                owner_id: user.id
                            }, callback);
                        } else {
                            callback(error);
                        }
                    });
                }, next);
            } else {
                next(error);
            }
        });
    });
};

exports.down = function(next) {
    next();
}
