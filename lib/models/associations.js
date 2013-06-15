var $ = require("jquery");

module.exports = function(models) {
    //User Associations
    models.USERS.belongsTo(models.USERS_PRICING, {foreignKey: 'code_pricing'});
    models.USERS_RECOVERY.belongsTo(models.USERS, {foreignKey: "user"});

    //Document Associations
    models.DOCUMENTS.belongsTo(models.USERS, {foreignKey: 'owner'});

    //Documents Calculated Associations
    models.DOCUMENTS_CALCULATED.belongsTo(models.USERS, {foreignKey: 'user'});
    models.DOCUMENTS_CALCULATED.belongsTo(models.DOCUMENTS, {foreignKey: 'document'});
    models.DOCUMENTS_CALCULATED.belongsTo(models.DOCUMENTS_PERMISSIONS, {foreignKey: 'permission'});

    //Sync Models With Database
    $.each(models, function(key, value) {
        value.sync();
    });

    return models;
}
