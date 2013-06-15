var $ = require("jquery");

module.exports = function(models) {

    //Users To Pricing
    models.USERS_PRICING.hasOne(models.USERS, { foreignKey: "code_pricing", joinTableName: "user_pricing" });
    models.USERS.belongsTo(models.USERS_PRICING, { foreignKey: "code_pricing", joinTableName: "user_pricing" });

    //Users To Recovery
    models.USERS.hasOne(models.USERS_RECOVERY, { foreignKey: "user", joinTableName: "user_recovery" });
    models.USERS_RECOVERY.belongsTo(models.USERS, { foreignKey: "user", joinTableName: "user_recovery" });

    //Users To Documents
    models.USERS.hasMany(models.DOCUMENTS, { foreignKey: "owner", joinTableName: "documents" });
    models.DOCUMENTS.belongsTo(models.USERS, { foreignKey: "owner", joinTableName: "documents" });

    //Users To Documents Calculated
    models.USERS.hasMany(models.DOCUMENTS_CALCULATED, { foreignKey: "user", joinTableName: "documents_calculated" });
    models.DOCUMENTS_CALCULATED.belongsTo(models.USERS, { foreignKey: "user", joinTableName: "documents_calculated" });

    //Documents Calculated To Documents
    models.DOCUMENTS.hasMany(models.DOCUMENTS_CALCULATED, { foreignKey: "document", joinTableName: "documents" });
    models.DOCUMENTS_CALCULATED.belongsTo(models.DOCUMENTS, { foreignKey: "document", joinTableName: "documents" });

    //Documents Calculated To Documents Permissions
    models.DOCUMENTS_PERMISSIONS.hasOne(models.DOCUMENTS_CALCULATED, { foreignKey: "permission", joinTableName: "documents_permissions" });
    models.DOCUMENTS_CALCULATED.belongsTo(models.DOCUMENTS_PERMISSIONS, { foreignKey: "permission", joinTableName: "documents_permissions" });

    //Sync Models With Database
    $.each(models, function(key, value) {
        value.sync();
    });

    //Return Models
    return models;
}
