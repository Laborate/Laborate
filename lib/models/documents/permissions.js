var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("code_document_permissions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
    });
}
