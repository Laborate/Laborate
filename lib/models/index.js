var $ = require("jquery");
var Sequelize = require("sequelize");

sequelize = new Sequelize('laborate_test', 'root', 'bjv0623', {
    host: 'localhost',
    port: 3306,
    protocol: null,
    logging: false,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    omitNull: false,
    define: {
        underscored: true,
        freezeTableName: true,
        syncOnAssociation: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    },
    sync: {
        force: true
    },
    syncOnAssociation: true,
    pool: {
        maxConnections: 5,
        maxIdleTime: 30
    }
});

module.exports = require("./associations")({
    //Core
    sequelize: sequelize,

    //Users
    USERS: sequelize.import(__dirname + "/users"),
    USERS_RECOVERY: sequelize.import(__dirname + "/users/recovery"),
    USERS_PRICING: sequelize.import(__dirname + "/users/pricing"),

    //Documents
    DOCUMENTS: sequelize.import(__dirname + "/documents"),
    DOCUMENTS_PERMISSIONS: sequelize.import(__dirname + "/documents/permissions"),
    DOCUMENTS_CALCULATED: sequelize.import(__dirname + "/documents/calculated")
});
