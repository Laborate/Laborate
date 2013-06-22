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
        db.settings.set("instance.cache", true);
        db.settings.set("instance.autoSave", true);
        db.settings.set("instance.autoFetch", true);
        db.settings.set("instance.autoFetchLimit", 2);

        /* Define Models */
        models.users = require("./users")(db);
        models.users_pricing = require("./users/pricing")(db);
        models.documents = require("./documents")(db);
        models.documents_roles = require("./documents/roles")(db);
        models.documents_permissions = require("./documents/permissions")(db);

        /* Associations */
        models.users.hasOne("code_pricing", models.users_pricing, {reverse: 'users'});
        models.documents.hasOne("owner", models.users);
        models.documents_roles.hasOne("user", models.users);
        models.documents_roles.hasOne("document", models.documents);
        models.documents_roles.hasOne("permission", models.documents_permissions);

        /* Sync With Database */
        db.sync();
    }
});
