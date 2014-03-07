module.exports = function (db, models) {
    return db.define("users_group", {
        pub_id: {
            type: "text"
        },
        name: {
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
            name: db.enforce.unique(),
            pub_id: db.enforce.unique()
        }
    });
}
