var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("user_pricing", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        documents: {
            type: DataTypes.INTEGER,
            allowNull:false
        }
    }, {
        tableName: "code_user_pricing"
    });
}
