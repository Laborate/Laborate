var jsdom = require("jsdom").jsdom;
var html = "<html><head></head><body><textarea id='code'></textarea></body></html>";
var window = jsdom(html).parentWindow;
var document = window.document;
var editor;
var scriptEl = window.document.createElement("script");
scriptEl.src = '../../node_modules/codemirror/lib/codemirror.js';
window.document.head.appendChild(scriptEl);

//Wait For CodeMirror To Load
var interval = setInterval(function() {
    if(window.CodeMirror) {
        editor = window.CodeMirror(document.getElementById("code"));
        clearInterval(interval);
    }
}, 10);


//Create Export Function
module.exports = function (content, changes, callback) {
    editor.setValue((content) ? content.join("\n") : "");

    //Apply Change Objects
    $.each(changes, function(index, value) {
        editor.replaceRange(value['text'], value['from'], value['to']);
    });

    callback(editor.getValue());
}
