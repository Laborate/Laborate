var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("code_documents_calculated", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        tableName: "code_documents_calculated"
    });
}
