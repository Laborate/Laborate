module.exports = function (db, models) {
    return db.define("organizations_roles", {
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
        },
        validations: {
            user_id: db.enforce.unique({ scope: ['organization_id'] }),
            permission_id: db.enforce.ranges.number(1, 5)
        }
    });
}
