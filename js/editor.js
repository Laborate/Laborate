$(window).ready(function() {

     window.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true,
            width: "100%",
            height: "100%",
            tabMode: "indent",
            dragDrop: false,
            theme: "neat",
            onBlur: function(cm) {
                if(window.activated) {
                    window.nodeSocket.emit('cursors' , {"from":window.userId, "line":cm.getCursor().line, "isOff":true} );
                }
            },
            onCursorActivity: function(cm) {
                if(window.activated) {
                    window.nodeSocket.emit('cursors' , {"from":window.userId, "line":cm.getCursor().line} );
                }
                editor.matchHighlight("CodeMirror-matchhighlight");
                $("#editorCodeMirror .CodeMirror-gutter-text pre").css({"font-weight":"", "color":""});
                $("#editorCodeMirror .CodeMirror-gutter-text pre").eq(cm.getCursor().line).css({"font-weight":"bold", "color":"#000"});
            },
            onChange: function(cm) {
                if(window.bounceBack == true) {
                    window.bounceBack = false;
                }
                else {
                    window.editor.onDeleteLine(cm.getCursor().line, function(){
                        if(window.activated) {
                            window.nodeSocket.emit( 'editor' , {"from": window.userId, "delete": cm.getCursor().line} )
                        }
                    });

                    if(window.activated) {
                        window.nodeSocket.emit( 'editor' , {"from": window.userId,
                                                            "line": cm.getCursor().line,
                                                            "code": editor.getLine(cm.getCursor().line)
                                                            } );
                    }

                }
            },
            onGutterClick: function(cm, n) {
                var info = cm.lineInfo(n);
                if (info.markerText){
                    cm.clearMarker(n);
                    if(window.activated) {
                        window.nodeSocket.emit( 'editor' , {"from": window.userId, "extras": {"lineMarker": [n, true]}} );
                    }
                }
                else {
                    cm.setMarker(n, '<span style="color: #56606E">●</span> %N%');
                    if(window.activated) {
                        window.nodeSocket.emit( 'editor' , {"from": window.userId, "extras": {"lineMarker": [n, false]}} );
                    }
                }
            }
    });

    for (var i = 0; i < window.editor.lineCount() - 1; i++) {
        window.editor.onDeleteLine((i), function(){
            if(window.activated) {
                window.nodeSocket.emit( 'editor' , {"from": window.userId, "delete": i} );
            }
        });
    }

});

$("#editorContainer").live("click", function() {
    window.editor.focus()
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
                            "diff":"diff",
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
                            "sql":"mysql",
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
    else { var modeName = "changes" }

    window.editor.setOption("mode", modeName);
    CodeMirror.autoLoadMode(window.editor, modeName);
    setTimeout(function () { window.editor.refresh(); }, 100)
}

//Pull New Code
window.nodeSocket.on('editor', function (data) {
    if(window.activated) {
        if(data["from"] != window.userId) {
            if(data["extras"] == null || data["extras"] == "undefined") {
                if(data["delete"] == null || data["delete"] == "undefined") {
                    if(window.editor.lineInfo(data['line']) == null) {
                        window.editor.replaceRange("\n" + data['code'], {"line":data['line'], "ch": 0});
                    }
                    window.editor.setLine(data['line'], data['code']);
                    window.bounceBack = true;
                }
                else {
                    window.editor.removeLine(data["delete"]);
                }
            }
            else {
                if(data["extras"]["docName"] != null && data["extras"]["docName"] != "") {
                    setTitle(data["extras"]["docName"]);
                }

                if(data["extras"]["initialCode"] != null && data["extras"]["initialCode"] != "") {
                    window.editor.setValue(data["extras"]["initialCode"]);
                }

                if(data["extras"]["passChange"] != null && data["extras"]["passChange"] != "") {
                    window.location.reload(true);
                }

                if(data["extras"]["lineMarker"] != null && data["extras"]["lineMarker"] != "") {
                    var n  = data["extras"]["lineMarker"][0]
                    if (data["extras"]["lineMarker"][1]){
                        window.editor.clearMarker(n);
                    }
                    else {
                        window.editor.setMarker(n, '<span style="color: #56606E">●</span> %N%');
                    }
                }
            }
        }
    }
});


//Broadcast User Info
setInterval(function() {
    if(window.activated) {
        window.nodeSocket.emit('users' , {"from":window.userId, "name":$.cookie("screenName")} );
    }
}, 1000);


//Pull User Info
window.nodeSocket.on('users', function (data) {
    if(window.activated) {
        if(data['from'] != window.userId && (""+data['from']) != "null") {
            if(data["isLeave"]) {
                userBlock(data['from'], data['name'], true);
            }
            else {
                userBlock(data['from'], data['name']);
            }
        }
    }
});


//Pull Cursor Info
window.nodeSocket.on('cursors', function (data) {
    if(window.activated) {
        if(data['from'] != window.userId && (""+data['from']) != "null") {
            if(data['isOff']) {
                usersCursors(data['from'], data['line'], true);
            }
            else {
                usersCursors(data['from'], data['line']);
            }
        }
    }
});