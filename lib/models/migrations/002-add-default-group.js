exports.up = function(next){
    lib.models_init(null, function(db, models) {
        lib.core.extensions();

        models.users.all({}, { autoFetch: false }).only("id").run(function(error, users) {
            if(!error && !users.empty) {
                async.each(users, function(user, callback) {
                    models.users.groups.exists({
                        owner_id: user.id
                    }, function(error, exists) {
                        if(!error && !exists) {
                            models.users.groups.create({
                                name: "Friends",
                                description: "List of my friends",
                                owner_id: user.id,
                                private: true
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
