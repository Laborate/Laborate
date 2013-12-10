module.exports = function (db, models) {
    return db.define("documents_roles", {
        document_pub_id: {
            type: "text",
            required: true
        },
        viewed: {
            type: "number",
            required: true,
            defaultValue: 0
        },
        readonly: {
            type: "boolean",
            defaultValue: false
        },
        access: {
            type: "boolean",
            defaultValue: true
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
        },
        validations: {
            user_id: db.enforce.unique({ scope: ['document_id'] }),
            permission_id: db.enforce.ranges.number(1, 3)
        }
    });
}
