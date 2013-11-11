module.exports = function (db, models) {
    return db.define("notifications", {
        name: {
            type: "text",
            required: true
        },
        description: {
            type: "text",
            required: true
        },
        priority: {
            type: "number",
            required: true,
            defaultValue: 0
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
