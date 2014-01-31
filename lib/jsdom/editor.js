var async = require("async");
var jsdom = require("jsdom").jsdom;

//Create Export Function
module.exports = function (content, changes, callback) {
    process.nextTick(function() {
        var html = "<html><head></head><body><textarea id='code'></textarea></body></html>";
        var window = jsdom(html).parentWindow;
        var document = window.document;
        var editor;
        var scriptEl = window.document.createElement("script");
        scriptEl.src = '../../node_modules/codemirror/lib/codemirror.js';
        window.document.head.appendChild(scriptEl);

        async.series([
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
                    async.eachSeries(changes, function(value, next) {
                        setTimeout(function() {
                            editor.replaceRange(value['text'], value['from'], value['to']);
                            next();
                        }, 50);
                    }, function(error) {
                        callback(editor.getValue());
                        next();
                    });
                });
            }
        ]);
    });
}
