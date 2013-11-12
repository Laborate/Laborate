var orm = require("orm");

function configure(db, models) {
    /* Settings */
    db.settings.set("properties.primary_key", "id");
    db.settings.set("instance.cache", false);
    db.settings.set("instance.autoSave", false);
    db.settings.set("instance.autoFetch", true);
    db.settings.set("instance.autoFetchLimit", 21);

    /* Define Models */
    models.users = require("./users")(db, models);
    models.users.pricing = require("./users/pricing")(db, models);
    models.users.notifications = require("./notifications")(db, models);
    models.documents = require("./documents")(db, models);
    models.documents.permissions = require("./documents/permissions")(db, models);
    models.documents.roles = require("./documents/roles")(db, models);

    /* Associations */
    models.users.hasOne("pricing", models.users.pricing, {reverse: 'users'});
    models.users.notifications.hasOne("user", models.users, {reverse: 'notifications'});
    models.documents.hasOne("owner", models.users, {required: true});
    models.documents.roles.hasOne("user", models.users, {required: true});
    models.documents.roles.hasOne("document", models.documents, {reverse: 'roles', required: true});
    models.documents.roles.hasOne("permission", models.documents.permissions, {required: true});

    /* Drop All Tables */
    if(config.orm.reset) {
        db.drop(blank_function);
    }

    /* Sync With Database */
    db.sync(function(error) {
        if(!error && config.orm.reset) {
            /* Preload Data */
            require("./preload")(models);
        }
    });
    return models;
}

module.exports = {
    express: orm.express(config.orm, {
        define: function (db, models) {
            models = configure(db, models);
        }
    }),
    socket: function(callback) {
        orm.connect(config.orm, function (error, db) {
            callback(configure(db, {}));
        });
    }
}
