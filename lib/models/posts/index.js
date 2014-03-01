var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("posts", {
        pub_id: String,
        content: {
            type: "text",
            big: true
        }
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            }
        }
    });
};
