var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("user_recovery", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.STRING,
            validate: {
                isUUID: 4
            }
        }
    });
}
