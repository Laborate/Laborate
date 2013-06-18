var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("document_permissions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        description: {
            type: DataTypes.STRING,
            allowNull:false
        }
    }, {
        tableName: "code_document_permissions"
    });
}
