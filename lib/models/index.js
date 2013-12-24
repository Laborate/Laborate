var orm = require("orm");
var modts = require('orm-timestamps');
var paging = require("orm-paging");

module.exports = function(main, callback, withValues, init) {
    var models = {};

    orm.connect(config.orm, function (error, db) {
        /* Capture Any Errors */
        lib.error.capture(error);

        /*
            Sometimes db is undefined
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

            /* Use Plugins */
            db.use(paging);
            db.use(modts, {
                persist: true,
                createdProperty: 'created',
                modifiedProperty: 'modified',
                dbtype: {
                    type: 'date',
                    time: true
                },
                now: function() {
                    return new Date();
                }
            });

            /* Define Models */
            models.pricing = require("./pricing")(db, models);
            models.notifications = require("./notifications")(db, models);
            models.payments = require("./payments")(db, models);
            models.tracking = require("./tracking")(db, models);

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

            models.tracking.hasOne("user", models.users);
            models.tracking.hasOne("organization", models.organizations);

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
            if(init && config.orm.reset) {
                db.drop(lib.error.capture);
            }


            /* Sync With Database */
            db.sync(function(error) {
                lib.error.capture(error);

                if(init && !error && config.orm.reset) {
                    /* Preload Data */
                    require("./preload")(models);
                }
            });

            /* Attach To Main */
            if(main) {
                main.db = db;
                main.models = models;
            }

            /* Callback Function */
            if(callback) {
                if(withValues != false) {
                    callback(db, models);
                } else {
                    callback();
                }
            }
        }
    });
}
