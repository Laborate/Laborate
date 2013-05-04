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
    setEditorMode($("#mode").text());

    $.post("/php/session/download.php", { download_id: "" + $("#download_id").text() },
        function(dowload_response) {
            if(dowload_response != "Download: Failed") {
                proccessedDocuemt = "";
                var json = JSON.parse(dowload_response);
                var session_document = JSON.parse(json[1]);

                $.each(session_document, function(i, item) {
                    proccessedDocuemt += item;
                    if(i+1 != session_document.length) {
                        proccessedDocuemt += "\n";
                    } else {
                        window.editor.setValue(proccessedDocuemt);
                        finish();
                    }
                });
            } else {
                failed();
            }
    });
});

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
    }, 1000);
};