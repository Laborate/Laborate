var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("users_group", {
        pub_id: {
            type: "text"
        },
        name: {
            type: "text",
            required: true
        },
        private: {
            type: "boolean",
            required: true,
            defaultValue: false
        }
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            },
            afterCreate: function(success) {
                var _this = this;

                if(success) {
                    models.users.get(_this.owner_id, function(error, user) {
                        if(!error && user) {
                            user.addGroups(_this, lib.error.capture);
                        } else {
                            lib.error.capture(error);
                        }
                    });
                }
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
}
