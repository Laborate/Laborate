var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        screen_name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: DataTypes.STRING,
        verified: DataTypes.INTEGER,
        locations: DataTypes.STRING.BINARY,
        github: DataTypes.STRING
    });
}
