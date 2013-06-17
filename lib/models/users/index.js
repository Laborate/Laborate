var aes = require("../../core/aes");
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        screen_name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull:false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(1000),
            allowNull:false
        },
        verified: DataTypes.INTEGER,
        locations: DataTypes.STRING(3000),
        github: DataTypes.STRING(1000),
        recovery: {
            type: DataTypes.STRING,
            validate: {
                isUUID: 4
            }
        },
        key: {
            type: DataTypes.STRING(1000),
            allowNull:false
        }
    }, {
        instanceMethods: {
            get_key: function(password) {
                this.master_key = aes.decrypt(this.key, password);
                return this.master_key;
            },
            email_hash: function() {
                return crypto.createHash('md5').update(this.email).digest("hex");
            },
            locations: function() {
                return JSON.parse(aes.decrypt(this.locations, this.master_key));
            }
        }
    });
}
