var $ = require("jquery");
var orm = require("orm");

var opts = {
  database: config.orm.database,
  protocol: config.orm.dialect,
  host: config.orm.host,
  port: config.orm.port,
  user: config.orm.username,
  password: config.orm.password,
  query: {
    pool: true,
    debug: true
  }
};

module.exports = orm.express(opts, {
    define: function (db, models) {
        /* Settings */
        db.settings.set("properties.primary_key", "id");
        db.settings.set("instance.cache", false);
        db.settings.set("instance.autoSave", true);
        db.settings.set("instance.autoFetch", true);
        db.settings.set("instance.autoFetchLimit", 3);

        /* Define Models */
        models.users = require("./users")(db, models);
        models.users_pricing = require("./users/pricing")(db, models);
        models.documents = require("./documents")(db, models);
        models.documents_roles = require("./documents/roles")(db, models);
        models.documents_permissions = require("./documents/permissions")(db, models);

        /* Associations */
        models.users.hasOne("code_pricing", models.users_pricing, {reverse: 'users'});
        models.documents.hasOne("owner", models.users);
        models.documents_roles.hasOne("user", models.users);
        models.documents_roles.hasOne("document", models.documents, {reverse: 'roles'});
        models.documents_roles.hasOne("permission", models.documents_permissions);

        /* Sync With Database */
        db.sync(function(error) {
            if(!error) {
                /* Preload Data into Database */
                require("./preload")(models);
            }
        });
    }
});
