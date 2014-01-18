/* Url Parameters */
window.url_params = function() {
    params = /\/welcome\/(.*?)\//.exec(window.location.href);
    params_dict = {};
    params_dict["page"] = (params) ? params[1] : "index";
    return params_dict;
}

/* Init */
$(function() {
    if((window.url_params()["page"] + "Init") in window) {
        window[window.url_params()["page"] + "Init"]();
    }

    $("#content").hAlign();
    $(".previous, .next").vAlign().show();
    $(".previous .arrow, .next .arrow").vAlign();
    $("#footer").height($(window).height() - $("#footer").offset().top);
});

$(window).resize(function() {
    if((window.url_params()["page"] + "Resize") in  window) {
        window[window.url_params()["page"] + "Resize"]();
    }

    $("#footer").height($(window).height() - $("#footer").offset().top);
});

/* Creative Slide */
function creativeInit() {
    CodeMirror.modeURL = "/codemirror/mode/%N/%N.js"

    window.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        lineWrapping: false,
        matchBrackets: true,
        matchTags: true,
        tabMode: "indent",
        theme: "laborate",
        indentUnit: 4,
        indentWithTabs: true,
        smartIndent: true,
        autofocus: true,
        dragDrop: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        highlightSelectionMatches: false,
        styleSelectedText: false,
        styleActiveLine: false,
        gutters: ["CodeMirror-linenumbers"],
    });

    CodeMirror.autoLoadMode(window.editor, "clike");
    window.editor.setOption("mode", "text/x-java");
    window.editor.refresh();
    creativeResize();
}

function creativeResize() {
    var height = $(window).height() - $("#footer").offset().top;

    $("#footer .code").css({
        height: height - $("#footer #backdrop-header").height()
    });

    window.editor.setSize("", height - $("#footer #backdrop-header").height() - 10);
    window.editor.refresh();
}
