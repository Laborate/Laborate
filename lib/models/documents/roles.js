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
            afterSave: function() {
                var _this = this;
                models.documents.permissions.get(_this.permission_id, function(error, permission) {
                    _this.access = permission.access;
                    _this.save(lib.error.capture);
                });
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
