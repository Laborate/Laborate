var orm = require("orm");
var modts = require('orm-timestamps');
var paging = require("orm-paging");
var random = require("orm-random");

function configure(db, models, init, callback) {
    /* Settings */
    db.settings.set("properties.primary_key", "id");
    db.settings.set("instance.cache", false);
    db.settings.set("instance.autoSave", false);
    db.settings.set("instance.autoFetch", false);
    db.settings.set("instance.autoFetchLimit", 2);

    /* Use Plugins */
    db.use(random);
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
    models.users.groups = require("./users/groups")(db, models);
    models.users.feedback = require("./users/feedback")(db, models);

    models.organizations = require("./organizations")(db, models);
    models.organizations.permissions = require("./organizations/permissions")(db, models);
    models.organizations.roles = require("./organizations/roles")(db, models);

    models.documents = require("./documents")(db, models);
    models.documents.permissions = require("./documents/permissions")(db, models);
    models.documents.roles = require("./documents/roles")(db, models);

    models.posts = require("./posts")(db, models);
    models.posts.tags = require("./posts/tags")(db, models);

    models.shortner = require("./shortner")(db, models);

    /* Page Settings */
    models.users.settings.set("pagination.perpage", 10);

    models.organizations.settings.set("pagination.perpage", 10);
    models.organizations.roles.settings.set("pagination.perpage", 10);

    models.documents.settings.set("pagination.perpage", 10);
    models.documents.roles.settings.set("pagination.perpage", 10);

    models.posts.settings.set("pagination.perpage", 10);
    models.posts.tags.settings.set("pagination.perpage", 10);

    /* Associations */
    models.users.hasOne("pricing", models.pricing, {reverse: 'users', autoFetch: true});
    models.organizations.hasOne("pricing", models.pricing, {reverse: 'organizations', autoFetch: true});

    models.users.groups.hasOne("owner", models.users);
    models.users.groups.hasMany("users", models.users, {}, {reverse: "groups", autoFetch: true, autoFetchLimit: 1});

    models.users.feedback.hasOne("user", models.users, {reverse: 'feedbacks'});

    models.posts.hasOne("owner", models.users, {required: true, autoFetch: true});
    models.posts.hasOne("parent", models.posts, {reverse: 'children', autoFetch: true});
    models.posts.hasOne("group", models.users.groups, {reverse: 'posts'});
    models.posts.hasMany("tags", models.posts.tags, {}, {reverse: 'posts'});
    models.posts.hasMany("likes", models.users, {}, { autoFetch: true });

    models.tracking.hasOne("user", models.users, {reverse: 'tracking'});
    models.tracking.hasOne("organization", models.organizations, {reverse: 'tracking'});

    models.notifications.hasOne("user", models.users, {reverse: 'notifications'});
    models.notifications.hasOne("organization", models.organizations, {reverse: 'notifications'});

    models.payments.hasOne("user", models.users, {reverse: 'payments'});
    models.payments.hasOne("organization", models.organizations, {reverse: 'payments'});

    models.organizations.hasOne("owner", models.users, {required: true});
    models.organizations.roles.hasOne("organization", models.organizations, {required: true, autoFetch: true});
    models.organizations.roles.hasOne("user", models.users, {reverse: "organizations", required: true, autoFetch: true});
    models.organizations.roles.hasOne("permission", models.organizations.permissions, {required: true, autoFetch: true});

    models.documents.hasOne("owner", models.users, {required: true});
    models.documents.roles.hasOne("document", models.documents, {reverse: 'roles', required: true, autoFetch: true});
    models.documents.roles.hasOne("user", models.users, {required: true, autoFetch: true});
    models.documents.roles.hasOne("permission", models.documents.permissions, {required: true, autoFetch: true});

    /* Attach Associations Getter */
    db.associations = require('./associations');

    if(init) {
        async.series([
            function(next) {
                if(config.orm.reset) {
                    db.drop(next);
                } else {
                    next();
                }
            },
            function(next) {
                if(config.orm.reset || config.orm.sync) {
                    db.sync(next);
                } else {
                    next();
                }
            },
            function(next) {
                if(config.orm.reset || config.orm.sync) {
                    require("./migrations")(db, next);
                } else {
                    next();
                }
            },
            function(next) {
                if(config.orm.reset || config.orm.preload) {
                    require("./preload")(models);
                }

                next();
            }
        ], function(errors) {
            lib.error.capture(errors);

            if(callback) callback();
        });
    } else if(callback) {
        callback();
    }
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
