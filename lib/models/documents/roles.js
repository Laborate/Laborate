module.exports = function (db, models) {
    return db.define("documents_roles", {
        user_pub_id: {
            type: "text",
            required: true
        },
        document_pub_id: {
            type: "text",
            required: true
        },
        viewed: {
            type: "number",
            required: true,
            defaultValue: 0
        },
        access: {
            type: "boolean",
            defaultValue: true
        }
    }, {
        timestamp: true,
        hooks: {
            afterAutoFetch: function() {
                if(this.permission) {
                    if(this.access != this.permission.access) {
                        this.save({
                            access: this.permission.access
                        }, lib.error.capture);
                    }
                }
            }
        },
        validations: {
            user_id: db.enforce.unique({
                scope: ['document_id']
            }),
            permission_id: db.enforce.ranges.number(1, 4)
        }
    });
}
