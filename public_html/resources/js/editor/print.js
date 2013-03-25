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

    if($("#mode").text() == "") { window.close(); }
    setMode($("#mode").text());

    $.post("/php/session/password_check.php", { session_id: $("#session_id").text(),
                                               session_password: $("#password").text()
                                        },
            function(password_response){
                if(password_response != "Password Authentication: Failed") {
                    setTimeout(function() {
                        $.post("/php/session/download.php", { download_id: "" + password_response },
                            function(dowload_response){
                                if(dowload_response != "Download: Failed") {
                                    proccessedDocuemt = "";
                                    var json = JSON.parse(dowload_response);
                                    $.each(json, function(i, item) {
                                        if(i+1 != json.length) { var new_line = "\n"; }
                                        else { var new_line = ""; }
                                        proccessedDocuemt += item + new_line;
                                    });
                                    window.editor.setValue(proccessedDocuemt);
                                    finish();
                                }
                                else { failed(); }
                            }
                        );
                    }, 500);
                }
                else { failed(); }
        }
    );
});

function setMode(mode) {
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
    else { var modeName = "changes" }

    window.editor.setOption("mode", modeName);
    CodeMirror.autoLoadMode(window.editor, modeName);
    window.editor.refresh();
}

function failed() {
    $("#loading").text("Print Failed");

    setTimeout(function() {
        window.close();
    }, 5000)
}

function finish() {
    $("#loading").hide();
    setTimeout(function() {
        window.editor.refresh();
        window.print();
        window.close();
    }, 500);
};