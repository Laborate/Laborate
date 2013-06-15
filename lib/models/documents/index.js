var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("code_documents", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        content: DataTypes.STRING.BINARY,
        password: DataTypes.STRING,
        breakpoints: DataTypes.STRING.BINARY,
        external_path: DataTypes.STRING,
        location: DataTypes.INTEGER
    });
}
