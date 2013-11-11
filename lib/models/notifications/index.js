module.exports = function (db, models) {
    return db.define("notifications", {
        message: {
            type: "text",
            required: true
        },
        priority: {
            type: "boolean",
            required: true,
            defaultValue: false
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
            beforeSave: function() {
                this.updated = new Date();
            }
        }
    });
}
