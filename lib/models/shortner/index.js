var rand = require("generate-key");

module.exports = function (db, models) {
    var shortner = db.define("shortner", {
        pub_id: String,
        url: String
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(6);
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });

    shortner.generate = function(url, callback) {
        models.shortner.find({
            url: url
        }, 1, function(error, shortned) {
            if(!error) {
                if(!shortned.empty) {
                    callback(null, shortned[0].pub_id);
                } else {
                    models.shortner.create({
                        url: url
                    }, function(error, shortned) {
                        if(!error && shortned) {
                            callback(null, shortned.pub_id);
                        } else {
                            callback(error);
                        }
                    });
                }
            } else {
                callback(error);
            }
        });
    }

    return shortner;
};
