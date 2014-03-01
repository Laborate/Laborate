var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("posts_tag", {
        tag: String
    }, {
        timestamp: true
    });
};
