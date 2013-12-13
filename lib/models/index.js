var orm = require("orm");
var preloaded = false;

function init(main, callback) {
    var models = {};

    orm.connect(config.orm, function (error, db) {
        /* Capture Any Errors */
        lib.error.capture(error);

        /*
            HACK FIX: Sometimes db is undefined
            or defined with no settings object
            with no errors reported
        */
        if(!db || !db.settings) {
            lib.error.capture("DB object is empty");
        } else {
            /* Settings */
            db.settings.set("properties.primary_key", "id");
            db.settings.set("instance.cache", false);
            db.settings.set("instance.autoSave", false);
            db.settings.set("instance.autoFetch", true);
            db.settings.set("instance.autoFetchLimit", 2);

            /* Define Models */
            models.pricing = require("./pricing")(db, models);
            models.notifications = require("./notifications")(db, models);
            models.payments = require("./payments")(db, models);

            models.users = require("./users")(db, models);

            models.organizations = require("./organizations")(db, models);
            models.organizations.permissions = require("./organizations/permissions")(db, models);
            models.organizations.roles = require("./organizations/roles")(db, models);

            models.documents = require("./documents")(db, models);
            models.documents.permissions = require("./documents/permissions")(db, models);
            models.documents.roles = require("./documents/roles")(db, models);

            /* Associations */
            models.users.hasOne("pricing", models.pricing, {reverse: 'users'});
            models.organizations.hasOne("pricing", models.pricing, {reverse: 'organizations'});

            models.notifications.hasOne("user", models.users, {reverse: 'notifications'});
            models.notifications.hasOne("organization", models.organizations, {reverse: 'notifications'});

            models.payments.hasOne("user", models.users, {reverse: 'payments'});
            models.payments.hasOne("organization", models.organizations, {reverse: 'payments'});

            models.organizations.hasOne("owner", models.users, {required: true});
            models.organizations.roles.hasOne("organization", models.organizations, {reverse: 'roles', required: true});
            models.organizations.roles.hasOne("user", models.users, {reverse: "organizations", required: true});
            models.organizations.roles.hasOne("permission", models.organizations.permissions, {required: true});

            models.documents.hasOne("owner", models.users, {required: true});
            models.documents.roles.hasOne("document", models.documents, {reverse: 'roles', required: true});
            models.documents.roles.hasOne("user", models.users, {required: true});
            models.documents.roles.hasOne("permission", models.documents.permissions, {required: true});

            /* Drop All Tables */
            if(config.orm.reset) {
                db.drop(lib.error.capture);
            }

            /* Sync With Database */
            db.sync(function(error) {
                lib.error.capture(error);

                if(config.orm.reset && !error && !preloaded) {
                    /* Preload Data */
                    require("./preload")(models);
                    preloaded = true;
                }
            });

            main.db = db;
            main.models = models;
            if(callback) callback(db, models);
        }
    });
}

module.exports = init;
