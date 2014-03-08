var Task = require('migrate-orm2');

module.exports = function(db, callback) {
    var migrations = 'lib/models/migrations';
    var task = new Task(db.driver, {dir: migrations});

    async.series([
        function(next) {
            task.up(next);
        },
        function(next) {
            task.down(next);
        }
    ], callback);
}
