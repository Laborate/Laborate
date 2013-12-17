module.exports = function (db, models) {
    return db.define("organizations_roles", {
        gravatar: String
    }, {
        timestamp: true,
        validations: {
            user_id: db.enforce.unique({ scope: ['organization_id'] }),
            permission_id: db.enforce.ranges.number(1, 5)
        }
    });
}
