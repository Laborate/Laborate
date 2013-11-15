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
        },
        created: {
            type: "date",
            defaultValue: new Date()
        },
        updated: {
            type: "date",
            defaultValue: new Date()
        }
    }, {
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            },
            beforeSave: function() {
                this.updated = new Date();
            }
        }
    });
}
