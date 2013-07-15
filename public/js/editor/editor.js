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
    window.sidebarUtil.setTitle($("#document_title").text());


    //Pull New Code
    window.nodeSocket.on('editorDocument', function (data) {
        if(data["from"] != window.userId) {
            if(data["extras"] == null || data["extras"] == "undefined") {
                window.editorUtil.setChanges("in", data["changes"]);
            }
            else {
                if(data["extras"]["docName"] != null && data["extras"]["docName"] != "") {
                    window.sidebarUtil.setTitle(data["extras"]["docName"]);
                }

                if(data["extras"]["initialCode"] != null && data["extras"]["initialCode"] != "") {
                    window.editor.setValue(data["extras"]["initialCode"]);
                }

                if(data["extras"]["passChange"] == true) {
                    window.location.reload(true);
                }

                if(data["extras"]["breakpoint"] != null && data["extras"]["breakpoint"] != "") {
                    window.editorUtil.gutterClick("in", data["extras"]["breakpoint"]);
                }
            }
        }
    });

    //Pull User Info
    window.nodeSocket.on('editorUsers', function (data) {
        if(data["join"]) {
            window.editorUtil.users(data);
        } else if(data["leave"]) {
            window.editorUtil.users(data);
            window.editorUtil.userCursors("in", data);
        } else {
            window.editorUtil.users(data);
        }
    });

    //Pull Cursor Info
    window.nodeSocket.on('editorCursors', function (data) {
        window.editorUtil.userCursors("in", data);
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
