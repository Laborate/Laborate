var models = require("../");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("documents", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false
        },
        owner: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        content: DataTypes.STRING(4000),
        breakpoints: DataTypes.STRING(1000),
        external_path: DataTypes.STRING,
        location: DataTypes.INTEGER,
        key: {
            type: DataTypes.STRING(1000),
            allowNull:false
        }
    }, {
        tableName: "code_documents"
    });
}
