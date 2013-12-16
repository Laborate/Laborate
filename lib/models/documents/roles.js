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
        }
    }, {
        timestamp: true,
        validations: {
            user_id: db.enforce.unique({ scope: ['document_id'] }),
            permission_id: db.enforce.ranges.number(1, 3)
        }
    });
}
