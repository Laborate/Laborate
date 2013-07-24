$(window).ready(function() {
    CodeMirror.modeURL = "/codemirror/mode/%N/%N.js"

    window.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        tabMode: "indent",
        theme: "laborate",
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

    //Editor Mode (TEMPORARY)
    window.sidebarUtil.setTitle("in", $("#document_title").text());


    //Pull Document Changes
    window.nodeSocket.on('editorDocument', function (data) {
        window.editorUtil.setChanges("in", data["changes"]);
    });

    //Pull User Info
    window.nodeSocket.on('editorUsers', function (data) {
        window.editorUtil.users(data);
    });

    //Pull Cursor Info
    window.nodeSocket.on('editorCursors', function (data) {
        window.editorUtil.userCursors("in", data);
    });

    //Pull Extras Info
    window.nodeSocket.on('editorExtras', function (data) {
        if("docName" in data) {
            window.sidebarUtil.setTitle("in", data["docName"]);
        }

        if("breakpoint" in data) {
            window.editorUtil.gutterClick("in", data["breakpoint"]);
        }

        if(data["docDelete"] == true) {
            window.location.href = "/documents/";
        }

        if(data["passChange"] == true) {
            window.location.reload(true);
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
});
