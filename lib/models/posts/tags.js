var rand = require("generate-key");

module.exports = function (db, models) {
    var tags =  db.define("posts_tag", {
        name: String
    }, {
        timestamp: true,
        validations: {
            name: db.enforce.unique()
        }
    });

    tags.findOrCreate = function(name, callback) {
        models.posts.tags.find({
            name: name
        }, function(error, tags) {
            if(!error) {
                if(tags.empty) {
                    models.posts.tags.create({
                        name: name
                    }, function(error, tag) {
                        if(!error && tag) {
                            callback(null, tag);
                        } else {
                            callback(error);
                        }
                    });
                } else {
                    callback(null, tags[0]);
                }
            } else {
                callback(error);
            }
        });
    };

    return tags;
};
