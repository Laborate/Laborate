var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("code_documents_calculated", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user: DataTypes.INTEGER,
        document_id: DataTypes.INTEGER,
        document_name: DataTypes.STRING,
        document_password: DataTypes.BOOLEAN,
        document_location: DataTypes.INTEGER,
        document_permission: DataTypes.INTEGER
    }, {
        tableName: "code_documents_calculated"
    });
}
