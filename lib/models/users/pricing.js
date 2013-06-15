var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("user_pricing", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        cost: DataTypes.INTEGER,
        documents: DataTypes.INTEGER
    }, {
        tableName: "code_user_pricing"
    });
}
