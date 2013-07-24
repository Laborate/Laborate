$(window).ready(function() {
    /* Initalize */
    $("#keyMap_" + $.cookie("keyMap")).attr("selected", "selected");
    window.sidebarUtil.keyMap($.cookie("keyMap"));
    window.sidebarUtil.change($("#sidebar_header .default").attr("id"));

    /* Core Operations */
    $("#sidebar_header img").live("click", function() {
        window.sidebarUtil.change($(this).attr("id"), "");
    });

    $("#sidebar #sidebar_header img").live("click mousedown", function() {
        return false;
    });

    $("#sidebar form").live("submit", function() {
        return false;
    });

    /* Triggers: Documents */
    $("#document_undo").live("click", function() {
        window.editor.undo();
    });

    $("#document_redo").live("click", function() {
        window.editor.redo();
    });

    $("#document_format").live("click", window.sidebarUtil.format);


    /* Triggers: Find */
    $("#lineNumberList .listX").live("click", function() {
        window.sidebarUtil.highlightRemove($(this).parent());
    });

    $("#findList .listX").live("click", function() {
        window.sidebarUtil.searchRemove($(this));
    });

    $("#lineNumberJumpForm").live("submit", function() {
        window.sidebarUtil.jumpToLine($("#lineNumberJump").val());
        $("#lineNumberJump").val("");
        return false;
    });

    $("#lineNumberForm").live("submit", function() {
         window.sidebarUtil.highlight($("#lineNumber").val());
         $("#lineNumber").val("");
         return false;
    });

    $("#findWordsForm").live("submit", function() {
        window.sidebarUtil.search($("#findWords").val());
        $("#findWords").val("");
        return false;
    });

    /* Triggers: Share */
    $("#email_share").live("submit", window.sidebarUtil.email_invite);
    setTimeout(window.sidebarUtil.copy_button, 1000);

    /* Triggers: Download */
    $("#downloadFile").live("click", window.sidebarUtil.downloadFile);
    $("#githubCommit").live("click", window.sidebarUtil.commitFile);
    $("#saveToServer").live("click", window.sidebarUtil.pushFile);

    /* Triggers: Settings */
    $("#password_change").on("click", window.sidebarUtil.togglePassword);
    $("#settingsSave").on("click", window.sidebarUtil.settings);

    $("#removeDoc, #actionConfirmCancel").live("click", function() {
        $("#removeConfirm").slideToggle();
    });

    $("#removeConfirmClick").on("click", window.sidebarUtil.remove);
});
