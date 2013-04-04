/* Requires */
//var aes = require('./aes.js');
var base = require('./config.js');
var connection = base.connection;

/* Module Exports */
module.exports = {
    session_authentication: function(data, callback) {
        var session_pull = 'SELECT session_id, session_password FROM sessions WHERE session_id = ' + data['session'];
        connection.query(session_pull, function(err, sql_results) {
            var sql_session_id = sql_results[0]["session_id"];
            //var sql_session_password = aes.decrypt(sql_results[0]["session_password"], base.crypt_salt);
            //callback(sql_session_id == session_new_id && sql_session_password == data['password']);
            callback(sql_session_id == data['session']);
        });
    },
    session_breakpoint: function(session, data) {
        var session_pull = 'SELECT session_breakpoints FROM sessions WHERE session_id = ' + session;
        connection.query(session_pull, function(err, sql_results) {
            var sql_session_breakpoints = JSON.parse(sql_results[0]["session_breakpoints"]);
            if(data['remove']) {
                sql_session_breakpoints.splice(sql_session_breakpoints.indexOf(data["line"]), 1);

            } else {
                sql_session_breakpoints.push(data["line"]);
            }

            var session_push = 'Update sessions SET session_breakpoints="' + JSON.stringify(sql_session_breakpoints) + '" WHERE session_id = ' + session;
            connection.query(session_push);
        });
    },
    session_document: function(session, data) {
        var session_pull = 'SELECT session_document FROM sessions WHERE session_id = ' + session;
        connection.query(session_pull, function(err, sql_results) {
            var sql_session_document = JSON.parse(sql_results[0]["session_document"]);

            //console.log(sql_session_document);
            //console.log(data);

            var session_push = 'Update sessions SET session_document="' + JSON.stringify(sql_session_document) + '" WHERE session_id = ' + session;
            connection.query(session_push);
        });
    }
}