var jsdom = require("jsdom").jsdom;

//Create Export Function
module.exports = function (content, changes, callback) {
    return process.nextTick(function() {
        var html = "<html><head></head><body><textarea id='code'></textarea></body></html>";
        var window = jsdom(html).parentWindow;
        var document = window.document;
        var editor;
        var scriptEl = window.document.createElement("script");
        scriptEl.src = '../../node_modules/codemirror/lib/codemirror.js';
        window.document.head.appendChild(scriptEl);

        return async.series([
            function(next) {
                var interval = setInterval(function() {
                    if(window.CodeMirror) {
                        editor = window.CodeMirror(document.getElementById("code"));
                        clearInterval(interval);
                        next(null);
                    }
                }, 10);
            },
            function(next) {
                next(null, editor.setValue((!content.empty) ? content.join("\n") : ""));
            },
            function(next) {
                //Apply Change Objects
                editor.operation(function() {
                    async.eachSeries(changes, function(data, next) {
                        var current = data.next;

                        editor.replaceRange(
                            data.text,
                            data.from,
                            data.to
                        );

                        async.whilst(function() {
                            return !!current;
                        }, function (callback) {
                            editor.replaceRange(
                                current.text,
                                current.from,
                                current.to
                            );

                            current = current.next;
                            callback();
                        }, next);
                    }, next);
                });
            }
        ], function() {
            return callback(editor.getValue());
        });
    });
}
