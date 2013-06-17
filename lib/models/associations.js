var $ = require("jquery");

module.exports = function(models) {

    //Users To Pricing
    models.USERS_PRICING.hasMany(models.USERS, { foreignKey: "code_pricing", as: "users" });
    models.USERS.belongsTo(models.USERS_PRICING, { foreignKey: "code_pricing", as: "pricing" });

    //Users To Documents
    models.USERS.hasMany(models.DOCUMENTS, { foreignKey: "owner", as: "documents" });
    models.DOCUMENTS.belongsTo(models.USERS, { foreignKey: "owner", as: "owner" });

    //Users To Documents Calculated
    models.USERS.hasMany(models.DOCUMENTS_CALCULATED, { foreignKey: "user", as: "documents_calculated" });
    models.DOCUMENTS_CALCULATED.belongsTo(models.USERS, { foreignKey: "user", as: "user" });

    //Documents Calculated To Documents
    models.DOCUMENTS.hasOne(models.DOCUMENTS_CALCULATED, { foreignKey: "document", as: "calculated" });
    models.DOCUMENTS_CALCULATED.belongsTo(models.DOCUMENTS, { foreignKey: "document", as: "source" });

    //Documents Calculated To Documents Permissions
    models.DOCUMENTS_PERMISSIONS.hasMany(models.DOCUMENTS_CALCULATED, { foreignKey: "permission", as: "documents" });
    models.DOCUMENTS_CALCULATED.belongsTo(models.DOCUMENTS_PERMISSIONS, { foreignKey: "permission", as: "permission" });

    //Sync Models With Database
    $.each(models, function(key, value) {
        value.sync();
    });

    //Return Models
    return models;
}
