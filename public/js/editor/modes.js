function setEditorMode(mode) {
    if(mode in window.editorUtil.extensions) {
        var modeName = window.editorUtil.extensions[mode];
        var mode = window.editorUtil.languages[modeName];
    } else {
        var modeName = "None";
        var mode = null;
    }

    if(mode) {
        if(mode == "gfm") {
            CodeMirror.autoLoadMode(window.editor, "javascript");
            CodeMirror.autoLoadMode(window.editor, "css");
            CodeMirror.autoLoadMode(window.editor, "htmlmixed");
            CodeMirror.autoLoadMode(window.editor, "clike");
        } else if(["m", "h", "c", "cc", "cpp", "cxx", "java", "jar", "scala", "pch"].indexOf(mode) != -1) {
            CodeMirror.autoLoadMode(window.editor, "clike");
        } else if(mode == "application/json") {
            CodeMirror.autoLoadMode(window.editor, "javascript");
        }

        if(["application/json"].indexOf(mode) == -1) {
            CodeMirror.autoLoadMode(window.editor, mode);
        }
        window.editor.setOption("mode", mode);
    }

    window.sidebarUtil.setLanguage(modeName);
    setTimeout(function () { window.editor.refresh(); }, 100);
}

$(function() {
    window.editorUtil.languages = {
        "None": null,
        "Javascript": "javascript",
        "JSON": "application/json",
        "PHP": "php",
        "CSS":"css",
        "C": "text/x-csrc",
        "C++": "text/x-c++src",
        "Java": "text/x-java",
        "Scala": "text/x-c++src",
        "Matlab": {
            name: "octave",
            version: 2,
            singleLineStringErrors: false
        },
        "Coffee Script": "text/x-coffeescript",
        "Common Lisp": "commonlisp",
        "Clojure": "clojure",
        "Diff": "diff",
        "ELC": "elc",
        "Erlang": "erlang",
        "Go": "Go",
        "Groovy": "groovy",
        "Haskell": "haskell",
        "Haxe": "haxe",
        "Asp.net": "application/x-aspx",
        "Asp.net HTML": "htmlembedded",
        "Java Server Pages": "application/x-jsp",
        "EJS": "application/x-ejs",
        "Jade": "text/x-jade",
        "HTML": "htmlmixed",
        "PLIST": "htmlmixed",
        "LESS": "less",
        "Lua": "lua",
        "Github Markdown": "gfm",
        "Markdown": "markdown",
        "MYSQL": "mysql",
        "Ntriples": "nt",
        "Ocaml": "ocaml",
        "Pascal": "pascal",
        "Perl": "perl",
        "SQL": "sql",
        "Properties": "properties",
        "R": "r",
        "Spec": "spec",
        "Change Log": "changes",
        "RST": "rst",
        "Ruby": "ruby",
        "Rust": "rust",
        "Scheme": "scheme",
        "Bash": "shell",
        "Shell": "shell",
        "Sieve": "sieve",
        "Smalltalk": "smalltalk",
        "Smarty": "smarty",
        "Sparql": "sparql",
        "Stex": "stex",
        "Tiddly Wiki": "tiddlywiki",
        "VB": "vb",
        "VBS": "vbscript",
        "Velocity": "velocity",
        "Verilog": "verilog",
        "XML": "xml",
        "XQuery": "xquery",
        "Yaml": "yaml",
        "Python": "python",
        "Pig": "pig",
        "PSQL": "psql",
        "Sqlite3": "sqlite3"
    }

    window.editorUtil.extensions =  {
        "js":"Javascript", "json":"JSON",
        "php":"PHP",
        "css":"CSS",
        "h":"C", "c":"C", "cc":"C", "cpp":"C++",
        "cxx":"C++", "java":"Java", "jar":"Java","scala":"Scala",
        "pch":"C++",
        "m": "Matlab",
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
        "jsp":"Java Server Pages", "aspx":"Java Server Pages",
        "ejs": "EJS", "jade": "JADE",
        "html":"HTML","plist":"Plist",
        "less":"LESS",
        "lua":"Lua",
        "markdown":"Markdown", "mdown":"Markdown",
        "mkdn":"Github Markdown", "md":"Github Markdown",
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
        "sh":"Bash",
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
