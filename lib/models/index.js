var orm = require("orm");
var modts = require('orm-timestamps');
var paging = require("orm-paging");

function configure(db, models, init, callback) {
    /* Settings */
    db.settings.set("properties.primary_key", "id");
    db.settings.set("instance.cache", 20);
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
    models.users.feedback = require("./users/feedback")(db, models);

    models.organizations = require("./organizations")(db, models);
    models.organizations.permissions = require("./organizations/permissions")(db, models);
    models.organizations.roles = require("./organizations/roles")(db, models);

    models.documents = require("./documents")(db, models);
    models.documents.permissions = require("./documents/permissions")(db, models);
    models.documents.roles = require("./documents/roles")(db, models);

    /* Associations */
    models.users.hasOne("pricing", models.pricing, {reverse: 'users'});
    models.organizations.hasOne("pricing", models.pricing, {reverse: 'organizations'});

    models.users.feedback.hasOne("user", models.users, {reverse: 'feedbacks'});

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

        if(init) {
            if(config.orm.reset) {
                /* Preload Data */
                require("./preload")(models, function() {
                    killConnection(db, models);
                });
            } else {
                killConnection(db, models);
            }
        }
    });

    if(callback) callback();
}

function killConnection(db, models) {
    db = null;
    models = null;

    delete db;
    delete models;
}

exports.init = function(main, callback, withValues, init) {
    orm.connect(config.orm, function (error, db) {
        if(!error) {
            var models = {};
            configure(db, models, init, function() {
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
            });
        } else {
            lib.error.capture(error);
        }
    });
}

exports.express = orm.express(config.orm, {
    define: function (db, models, next) {
        configure(db, models, false, next);
    }
});
