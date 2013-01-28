$(window).ready(function() {
    window.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        lineWrapping: true,
        tabMode: "indent",
        readOnly: true,
        theme: "neat"
    });

    if($("#mode").text() == "") { window.close(); }
    setMode($("#mode").text());

    $.post("server/php/session/password_check.php", { session_id: $("#session_id").text(),
                                               session_password: $("#password").text()
                                        },
            function(password_response){
                if(password_response != "Password Authentication: Failed") {
                    setTimeout(function() {
                        $.post("server/php/session/download.php", { download_id: "" + password_response },
                            function(dowload_response){
                                if(dowload_response != "Download: Failed") {
                                    window.editor.setValue(dowload_response.substr(1, dowload_response.length - 2));
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
                            "h":"clike", "c":"clike", "cc":"clike", "cpp":"clike", "cxx":"clike", "cxx":"clike",
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
                            "sql":"plsql",
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