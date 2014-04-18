var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("payments", {
        pub_id: String,
        plan: String,
        amount: {
            type: "number",
            required: true
        },
        currency: {
            type: "text",
            required: true
        },
        description: {
            type: "text",
            required: true
        }
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
}
