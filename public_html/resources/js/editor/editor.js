$(window).ready(function() {
     CodeMirror.modeURL = "http://resources.code.dev.laborate.io/codemirror/mode/%N/%N.js"
     window.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true,
            tabMode: "indent",
            theme: "codelaborate",
            indentUnit: 4,
            indentWithTabs: true,
            smartIndent: true,
            autofocus: false,
            dragDrop: false,
            autoCloseBrackets: true,
            autoCloseTags: true,
            highlightSelectionMatches: true,
            styleSelectedText: true,
            styleActiveLine: false,
            gutters: ["CodeMirror-linenumbers", "breakpoints"]
    });

    window.editor.on("change", function(instance, changeObj) {
        window.editorUtil.setChanges("out", changeObj);
    });

    window.editor.on("gutterClick", function(cm, n) {
        window.editorUtil.gutterClick("out", {"line":n});
    });

    window.editor.on("cursorActivity", function() {
        window.editorUtil.userCursors("out", {"line":window.editor.getCursor().line, "remove":false});
    });

    window.editor.on("blur", function() {
        window.editorUtil.userCursors("out", {"remove":true});
    });
});

function setEditorMode(mode) {
    languageExtentsion =  { "js":"javascript",
                            "php":"php",
                            "css":"css",
                            "h":"clike", "c":"clike", "cc":"clike", "cpp":"clike", "cxx":"clike", "cxx":"clike","java":"clike",
                            "jar":"clike","scala":"clike","m":"clike", "pch":"clike",
                            "coffee":"coffeescript",
                            "lisp":"commonlisp",
                            "clj":"clojure",
                            "diff":"diff", "patch":"diff",
                            "ecl":"ecl",
                            "erlc":"erlang",
                            "go":"go",
                            "groovy":"groovy",
                            "lhs":"haskell",
                            "zip":"haxe",
                            "net":"htmlembedded", "asp":"htmlembedded", "jsp":"htmlembedded", "aspx":"htmlembedded",
                            "html":"htmlmixed","plist":"htmlmixed",
                            "less":"less",
                            "lua":"lua",
                            "markdown":"markdown", "mdown":"markdown", "mkdn":"markdown", "md":"markdown", "mkd":"markdown",
                            "mdwn":"markdown", "mdtxt":"markdown", "mdtext":"markdown", "text":"markdown",
                            "frm":"mysql", "myd":"mysql", "myi":"mysql",
                            "nt":"ntriples",
                            "ocaml":"ocaml", "ml":"ocaml", "mli":"ocaml",
                            "p":"pascal", "pl":"pascal", "pas":"pascal", "pascal":"pascal",
                            "pl":"perl", "pm":"perl", "pig":"pig",
                            "sql":"sql", "psql":"sql", "mysql":"sql", "sqlite3":"sql",
                            "properties":"properties",
                            "r":"r",
                            "spec":"spec",
                            "changelog":"changes",
                            "rst":"rst",
                            "rb":"ruby",
                            "rs":"rust",
                            "ss":"scheme",
                            "sh":"shell",
                            "sieve":"sieve",
                            "stinit":"smalltalk", "im":"smalltalk", "st":"smalltalk",
                            "tpl":"smarty",
                            "sparql":"sparql",
                            "tex":"stex", "stex":"stex", "sex":"stex",
                            "tiddler":"tiddlywiki", "tid":"tiddlywiki",
                            "vb":"vb",
                            "vbs":"vbscript",
                            "vsl":"velocity", "vm":"velocity",
                            "v":"verilog", "vp":"verilog",
                            "xml":"xml", "xmi":"xml", "xdr":"xml", "xdp":"xml", "xdl":"xml", "xql":"xml", "xsd":"xml",
                            "xsl":"xml", "xss":"xml", "xsl":"xml",
                            "xq":"xquery", "xqm":"xquery", "xquery":"xquery", "xqy":"xquery",
                            "yml":"yaml",
                            "py":"python", "p":"python", "pickle":"python", "pyd":"python", "pyo":"python",  "pyw":"python",
                            "rpy":"python" }

    if(mode in languageExtentsion) { var modeName = languageExtentsion[mode]; }
    else { var modeName = "shell" }

    window.editor.setOption("mode", modeName);
    CodeMirror.autoLoadMode(window.editor, modeName);
    setTimeout(function () { window.editor.refresh(); }, 100)
}

//Pull New Code
window.nodeSocket.on('editor', function (data) {
    if(data["from"] != window.userId) {
        if(data["extras"] == null || data["extras"] == "undefined") {
            window.editorUtil.setChanges("in", data["changes"]);
        }
        else {
            if(data["extras"]["docName"] != null && data["extras"]["docName"] != "") {
                window.editorUtil.setTitle(data["extras"]["docName"]);
            }

            if(data["extras"]["initialCode"] != null && data["extras"]["initialCode"] != "") {
                window.editor.setValue(data["extras"]["initialCode"]);
            }

            if(data["extras"]["passChange"] != null && data["extras"]["passChange"] != "") {
                window.location.reload(true);
            }

            if(data["extras"]["lineMarker"] != null && data["extras"]["lineMarker"] != "") {
                window.editorUtil.gutterClick("in", data["extras"]["lineMarker"]);
            }
        }
    }
});


//Broadcast User Info
setInterval(function() {
    window.nodeSocket.emit('users' , {"from":window.userId, "name":window.screenName} );
}, 1000);


//Pull User Info
window.nodeSocket.on('users', function (data) {
    if(data['from'] != window.userId && (""+data['from']) != "null") {
        if(data["isLeave"]) {
            window.editorUtil.users(data['from'], data['name'], true);
        }
        else {
            window.editorUtil.users(data['from'], data['name']);
        }
    }
});

//Pull Cursor Info
window.nodeSocket.on('cursors', function (data) {
    if(data['from'] != window.userId && (""+data['from']) != "null") {
        window.editorUtil.userCursors("in", data);
    }
});

$("#editorContainer").on("click", function() {
    window.editor.focus();
});

$(window).resize(function() {
    window.editorUtil.refresh();
});

setInterval(function(){
    window.editorUtil.refresh();
}, 1000);

$("#full_screen").live("click", function() {
    window.editorUtil.fullScreen();
});

$(".contributor").live("hover", function(){
    window.editorUtil.userHover($(this));
});

$(".contributor").live("mouseout", function(){
    window.editorUtil.userLeave();
});