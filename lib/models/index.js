var $ = require("jquery");
var orm = require("orm");

var opts = {
  database: "laborate_test",
  protocol: "mysql",
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "bjv0623",
  query: {
    pool: true,
    debug: true
  }
};

module.exports = orm.express(opts, {
    define: function (db, models) {
        /* Settings */
        db.settings.set("properties.primary_key", "id");
        db.settings.set("properties.cache", true);
        db.settings.set("properties.autoSave", true);
        db.settings.set("properties.autoFetch", true);
        db.settings.set("properties.autoFetchLimit", 2);

        /* Define Models */
        models.users = require("./users")(db);
        models.users_pricing = require("./users/pricing")(db);
        models.documents = require("./documents")(db);
        models.documents_calculated = require("./documents/calculated")(db);
        models.documents_permissions = require("./documents/permissions")(db);

        /* Associations */
        models.users.hasOne("code_pricing", models.users_pricing, {reverse: 'user'});
        models.documents.hasOne("owner", models.users);
        models.documents_calculated.hasOne("owner", models.users);
        models.documents_calculated.hasOne("document", models.documents);
        models.documents_calculated.hasOne("permission", models.documents_permissions);

        /* Sync With Database */
        db.sync();
    }
});
