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
        freezeTableName: false,
        syncOnAssociation: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    },
    sync: {
        force: false
    },
    syncOnAssociation: true,
    pool: {
        maxConnections: 5,
        maxIdleTime: 30
    },
    sync: {
        force: true
    }
});

//Make Models Visible
module.exports = {
    //Core
    Sequelize: sequelize,

    //Users
    USERS: sequelize.import(__dirname + "/users"),
    USER_RECOVERY: sequelize.import(__dirname + "/users/recovery"),
    USER_PRICING: sequelize.import(__dirname + "/users/pricing"),

    //Documents
    DOCUMENTS: sequelize.import(__dirname + "/documents"),
    DOCUMENT_PERMISSIONS: sequelize.import(__dirname + "/documents/permissions"),
    DOCUMENT_CALCULATED: sequelize.import(__dirname + "/documents/calculated"),
}

//Sync Models With Database
$.each(module.exports, function(key, value) {
    value.sync();
});
