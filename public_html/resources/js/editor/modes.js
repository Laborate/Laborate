function setEditorMode(mode) {
    languageExtentsion =  { "js":"text/javascript", "json":"application/json",
                            "php":"php",
                            "css":"css",
                            "h":"text/x-c++src", "c":"text/x-csrc", "cc":"text/x-csrc", "cpp":"text/x-c++src",
                            "cxx":"text/x-csharp", "java":"text/x-java", "jar":"text/x-java","scala":"text/x-c++src",
                            "m":"text/x-c++src", "pch":"text/x-c++src",
                            "coffee":"text/x-coffeescript",
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
                            "markdown":"gfm", "mdown":"gfm", "mkdn":"gfm", "md":"gfm", "mkd":"gfm",
                            "mdwn":"gfm", "mdtxt":"gfm", "mdtext":"gfm", "text":"gfm",
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

    if(modeName == "gfm") {
        CodeMirror.autoLoadMode(window.editor, "javascript");
        CodeMirror.autoLoadMode(window.editor, "css");
        CodeMirror.autoLoadMode(window.editor, "htmlmixed");
        CodeMirror.autoLoadMode(window.editor, "clike");
    }

    if(modeName in ["m", "h", "c", "cc", "cpp", "cxx", "java", "jar", "scala", "pch"]) {
        CodeMirror.autoLoadMode(window.editor, "clike");
    }

    window.editor.setOption("mode", modeName);
    CodeMirror.autoLoadMode(window.editor, modeName);
    setTimeout(function () { window.editor.refresh(); }, 100)
}