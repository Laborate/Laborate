function setEditorMode(extension) {
    if(extension in window.editorUtil.extensions) {
        var modeName = window.editorUtil.extensions[extension];
        var modeObject = window.editorUtil.languages[modeName];
    }

    if(!extension || !modeObject) {
        if(!extension) {
            Raven.captureMessage("Unknown Code Editor Extension: " + extension);
        } else if(!modeObject && modeName) {
            Raven.captureMessage("Unknown Code Editor Mode: " + modeName);
        }

        var modeName = "Plain Text";
        var modeObject = window.editorUtil.languages[modeName];
    } else {
        CodeMirror.autoLoadMode(window.editor, $.trim(modeObject.mode));

        setTimeout(function() {
            window.editor.setOption("mode", $.trim(modeObject.mime));

            setTimeout(function() {
                if(editor.getMode().name == "null") {
                    window.editor.setOption("mode", $.trim(modeObject.mode));
                }
            }, 100);
        }, 100);

        setTimeout(function() {
            if(editor.getMode().name == "null") {
                window.editor.setOption("mode", $.trim(modeObject.mode));
            }
        }, 300);
    }

    window.sidebarUtil.setLanguage(modeName);
    setTimeout(function () { window.editor.refresh(); }, 100);
}

$(function() {
    window.editorUtil.languages = {};
    $.each(CodeMirror.modeInfo, function(key, value) {
        window.editorUtil.languages[value.name] = {
            mime: value.mime,
            mode: value.mode
        }
    });

    window.editorUtil.extensions =  {
        "js":"JavaScript", "json":"JSON",
        "php":"PHP",
        "css":"CSS",
        "h":"C", "c":"C", "cc":"C", "cpp":"C++",
        "cxx":"C++", "java":"Java", "jar":"Java","scala":"Scala",
        "pch":"C++",
        "m": "Octave",
        "coffee":"Coffee Script",
        "lisp":"Common Lisp",
        "clj":"Clojure",
        "diff":"Diff", "patch":"Diff",
        "ecl":"ECL",
        "erlc":"Erlang",
        "go":"Go",
        "groovy":"Groovy",
        "lhs":"Haskell",
        "zip":"Haxe",
        "net":"Asp.net", "asp":"Asp.net HTML",
        "jsp":"Java Server Pages", "aspx":"JavaServer Pages",
        "ejs": "Embedded Javascript", "jade": "Jade",
        "html":"Embedded Javascript","plist":"Plist",
        "less":"LESS",
        "lua":"Lua",
        "markdown":"Markdown", "mdown":"Markdown",
        "mkdn":"GitHub Flavored Markdown", "md":"GitHub Flavored Markdown",
        "mkd":"Markdown", "mdwn":"Markdown", "mdtxt":"Markdown",
        "mdtext":"Markdown", "text":"Markdown",
        "frm":"MYSQL", "myd":"MYSQL", "myi":"MYSQL",
        "nt":"Ntriples",
        "ocaml":"Ocaml", "ml":"Ocaml", "mli":"Ocaml",
        "p":"Pascal", "pl":"Pascal", "pas":"Pascal", "Pascal":"Pascal",
        "pl":"Perl", "pm":"Perl", "pig":"Pig",
        "sql":"SQL", "psql":"PSQL", "mysql":"MYSQL",
        "sqlite3":"Sqlite3",
        "properties":"Properties",
        "r":"R",
        "spec":"Spec",
        "changelog":"Changes",
        "rst":"RST",
        "rb":"Ruby",
        "rs":"Rust",
        "ss":"Scheme",
        "sh":"Shell",
        "sieve":"Sieve",
        "stinit":"Smalltalk", "im":"Smalltalk", "st":"Smalltalk",
        "tpl":"Smarty",
        "sparql":"Sparql",
        "tex":"Stex", "stex":"Stex", "sex":"Stex",
        "tiddler":"Tiddly Wiki", "tid":"Tiddly Wiki",
        "vb":"VB",
        "vbs":"VBS",
        "vsl":"Velocity", "vm":"Velocity",
        "v":"Verilog", "vp":"Verilog",
        "xml":"XML", "xmi":"XML", "xdr":"XML", "xdp":"XML", "xdl":"XML", "xql":"XML", "xsd":"XML",
        "xsl":"XML", "xss":"XML", "xsl":"XML",
        "xq":"XQuery", "xqm":"XQuery", "xquery":"XQuery", "xqy":"XQuery",
        "yml":"Yaml",
        "py":"Python", "p":"Python", "pickle":"Python", "pyd":"Python", "pyo":"Python",  "pyw":"Python",
        "rpy":"Python"
    }
});
