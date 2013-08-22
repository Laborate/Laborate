module.exports = function (db, models) {
    return db.define("code_user_pricing", {
        name: {
            type: "text",
            required: true
        },
        cost: {
            type: "number",
            required: true
        },
        documents: {
            type: "number"
        }
    }, {
        cache: true,
        validations: {
            name: [
                db.validators.unique(),
            ],
            cost: [
                db.validators.unique(),
            ]
        }
    });
}
