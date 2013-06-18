var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("documents_calculated", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        document: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        permission: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        password: {
            type: DataTypes.BOOLEAN,
            allowNull:false
        }
    }, {
        tableName: "code_documents_calculated"
    });
}
