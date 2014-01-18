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

    $(window).resize();
});

$(window).resize(function() {
    if($("#footer").length != 0) {
        $("#footer").height($(window).height() - $("#footer").offset().top);
    }

    if((window.url_params()["page"] + "Resize") in  window) {
        window[window.url_params()["page"] + "Resize"]();
    }
});

/* Creative Slide */
function creativeInit() {
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
        styleActiveLine: false
    });

    CodeMirror.modeURL = "/codemirror/mode/%N/%N.js";
    CodeMirror.autoLoadMode(window.editor, "clike");
    window.editor.setOption("mode", "text/x-java");
    window.editor.refresh();
    creativeResize();
}

function creativeResize() {
    var height = $("#footer").outerHeight(true) - $("#footer #backdrop-header").outerHeight(true);

    $("#footer .code").height(height);
    window.editor.setSize("", height);
    window.editor.refresh();
}

/* Social Slide */
function socialInit() {
    $("#footer canvas").each(function() {
        var data = JSON.parse($(this).attr("data-documents"));

        if(data.length != 0) {
            var canvas = $(this).get()[0];
            var graph = canvas.getContext("2d");
            var width = 5;
            var rightShift = 30;

            graph.fillStyle="rgba(255, 255, 255, .2)";

            $.each(data, function(key, height) {
                graph.fillRect(rightShift, canvas.height-height, width, height);
                rightShift += width + 1;
            });
        } else {
            $(this).hide();
        }
    });

    socialResize();
}

function socialResize() {
    $("#footer .list").height(
        $("#footer").outerHeight(true) - $("#footer #backdrop-header").outerHeight(true) - 30
    );
}
