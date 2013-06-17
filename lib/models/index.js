var $ = require("jquery");
var Sequelize = require("sequelize");

sequelize = new Sequelize('laborate_test', 'root', 'bjv0623', {
    host: 'localhost',
    port: 3306,
    logging: console.log,
    dialect: 'mysql',
    omitNull: false,
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        syncOnAssociation: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'MYISAM'
    },
    sync: {
        force: false
    },
    pool: {
        maxConnections: 5,
        maxIdleTime: 30
    },
    maxConcurrentQueries: 100,
});

module.exports = require("./associations")({
    //Core
    sequelize: sequelize,

    //Users
    USERS: sequelize.import(__dirname + "/users"),
    USERS_PRICING: sequelize.import(__dirname + "/users/pricing"),

    //Documents
    DOCUMENTS: sequelize.import(__dirname + "/documents"),
    DOCUMENTS_PERMISSIONS: sequelize.import(__dirname + "/documents/permissions"),
    DOCUMENTS_CALCULATED: sequelize.import(__dirname + "/documents/calculated")
});
