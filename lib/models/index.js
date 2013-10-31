var orm = require("orm");

function configure(db, models) {
    /* Settings */
    db.settings.set("properties.primary_key", "id");
    db.settings.set("instance.cache", false);
    db.settings.set("instance.autoSave", false);
    db.settings.set("instance.autoFetch", true);
    db.settings.set("instance.autoFetchLimit", 2);

    /* Define Models */
    models.users = require("./users")(db, models);
    models.users_pricing = require("./users/pricing")(db, models);
    models.documents = require("./documents")(db, models);
    models.documents_roles = require("./documents/roles")(db, models);
    models.documents_permissions = require("./documents/permissions")(db, models);

    /* Associations */
    models.users.hasOne("code_pricing", models.users_pricing, {reverse: 'users'});
    models.documents.hasOne("owner", models.users, {required: true});
    models.documents_roles.hasOne("user", models.users, {required: true});
    models.documents_roles.hasOne("document", models.documents, {reverse: 'roles', required: true});
    models.documents_roles.hasOne("permission", models.documents_permissions, {required: true});

    /* Sync With Database */
    db.sync(function(error) {
        if(!error) {
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
