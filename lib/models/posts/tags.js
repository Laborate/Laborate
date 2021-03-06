var rand = require("generate-key");
var wordfilter = require('wordfilter');
wordfilter.addWords(config.explict);

module.exports = function (db, models) {
    var tags =  db.define("posts_tag", {
        name: String,
        explict: Boolean
    }, {
        timestamp: true,
        validations: {
            name: db.enforce.unique()
        }
    });

    tags.findOrCreate = function(name, callback) {
        models.posts.tags.one({
            name: name
        }, function(error, tag) {
            if(!error && !tag) {
                models.posts.tags.create({
                    name: name,
                    explict: wordfilter.blacklisted(name)
                }, function(error, tag) {
                    if(!error && tag) {
                        models.posts.tags.get(tag.id, function(error, tag) {
                            if(!error && tag) {
                                callback(null, tag);
                            } else {
                                callback(error);
                            }
                        });
                    } else {
                        callback(error);
                    }
                });
            } else {
                callback(error, tag);
            }
        });
    };

    return tags;
};
