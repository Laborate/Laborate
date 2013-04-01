/* Requires */
var aes = require('./aes.js');
var base = require('./config.js');
var connection = base.connection;

/* Module Exports */
module.exports = {
    join_session: function(socket, session_new_id, session_password) {
        var query = 'SELECT session_id, session_password FROM sessions WHERE session_id = ' + session_new_id;
        connection.query(query, function(err, sql_results) {
            var sql_session_id = sql_results[0]["session_id"];
            var sql_session_password = aes.decrypt(sql_results[0]["session_password"], base.crypt_salt);

            if(sql_session_id == session_new_id && sql_session_password == session_password) {
                console.log("success");
                socket.join(session_new_id);
            }
        });
    }
}