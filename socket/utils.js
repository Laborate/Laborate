/* Requires */
//var aes = require('./aes.js');
var mysql = require('../lib/mysql.js');

/* Module Exports */
module.exports = {
    session_authentication: function(data, callback) {
        var session_pull = 'SELECT session_id, session_password FROM sessions WHERE session_id = "' + data['session'] + '"';
        mysql.query(session_pull, function(err, sql_results) {
            if(!err && sql_results.length != 0) {
                var sql_session_id = sql_results[0]["session_id"];
                //var sql_session_password = aes.decrypt(sql_results[0]["session_password"], base.crypt_salt);
                //callback(sql_session_id == session_new_id && sql_session_password == data['password']);
                callback(sql_session_id == data['session']);
            } else {
                callback(false);
            }
        });
    },
    session_breakpoint: function(session, data, callback) {
        var session_pull = 'SELECT session_breakpoints FROM sessions WHERE session_id = "' + session + '"';
        mysql.query(session_pull, function(err, sql_results) {
            if(!err && sql_results.length != 0) {
                var sql_session_breakpoints = JSON.parse(sql_results[0]["session_breakpoints"]);
                if(data['remove']) {
                    sql_session_breakpoints.splice(sql_session_breakpoints.indexOf(data["line"]), 1);

                } else {
                    sql_session_breakpoints.push(data["line"]);
                }
                var session_push = 'Update sessions SET session_breakpoints="';
                session_push += JSON.stringify(sql_session_breakpoints) + '" WHERE session_id = "' + session + '"';
                mysql.query(session_push);
            } else {
                callback(false);
            }
        });
    },
    session_document: function(session, data, callback) {
        var session_pull = 'SELECT session_document FROM sessions WHERE session_id = "' + session + '"';
        mysql.query(session_pull, function(err, sql_results) {
            if(!err && sql_results.length != 0) {
                //Session Objects
                var sql_session_document = JSON.parse(sql_results[0]["session_document"]);
                var change_object = data['changes'];

                console.log(change_object);

                /*
                                                       TODO:
                -----------------------------------------------------------------------------------------
                        1) sql_session_document.slice(0, from_line) -> list1
                        2) sql_session_document.slice(to_line) -> list2

                        3) list1[from_line].substring(0, from_ch) -> string1
                        4) list1[from_line].substring(to_ch) -> string2
                        5) string1 + change_object["text"][0] + string2 -> list1[from_line]

                        6) if to_after:
                                change_object["text"][last element] + list2[0] -> list2[0]
                                list1 + change_object["text"].slice(1, -1) + list2 -> list3
                           else:
                                list1 + change_object["text"].slice(1) + list2 -> list3
                */

                var list1 = sql_session_document.slice(0, (change_object["from"]['line'] + 1));
                var list2 = sql_session_document.slice(change_object["to"]['line'] + 1);

                console.log(list1[change_object["from"]['line']]);

                var string1 = list1[change_object["from"]['line']].substring(0, change_object["from"]['ch']);
                var string2 = list1[change_object["from"]['line']].substring(change_object["to"]['ch']);

                list1[change_object["from"]['line']] = string1.concat(change_object["text"][0], string2);

                if ("after" in change_object["to"] && change_object["to"]["after"]) {
                    list2[0] = change_object["text"][change_object["text"].length-1] + list2[0]
                    final_session_document = list1.concat(change_object["text"].slice(1, -1), list2);
                } else {
                    final_session_document = list1.concat(change_object["text"].slice(1), list2);
                }

                var json_final_document = JSON.stringify(final_session_document);
                console.log("\n\n");

                //Save To Database
                //Use Single Quotes As A Wrapper For The JSON Object
                var session_push = "Update sessions SET session_document= ";
                session_push += mysql.escape(json_final_document) + " WHERE session_id = " + mysql.escape(session);
                mysql.query(session_push);
            } else {
                callback(false);
            }
        });
    }
}