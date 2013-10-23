$(function() {
    /* Core Operations */
    $("#sidebar_header .icon").on("click", function() {
        window.sidebarUtil.change($(this).attr("id"), "");
    });

    $("#sidebar form").on("submit", function() {
        return false;
    });

    /* Triggers: Documents */
    $("#document_undo").on("click", function() {
        window.editor.undo();
    });

    $("#document_redo").on("click", function() {
        window.editor.redo();
    });

    $("#document_format").on("click", window.sidebarUtil.format);


    /* Triggers: Find */
    $("#lineNumberList .listX").on("click", function() {
        window.sidebarUtil.highlightRemove($(this).parent());
    });

    $("#findList .listX").on("click", function() {
        window.sidebarUtil.searchRemove($(this));
    });

    $("#lineNumberJumpForm").on("submit", function() {
        window.sidebarUtil.jumpToLine($("#lineNumberJump").val());
        $("#lineNumberJump").val("");
        return false;
    });

    $("#lineNumberForm").on("submit", function() {
         window.sidebarUtil.highlight($("#lineNumber").val());
         $("#lineNumber").val("");
         return false;
    });

    $("#findWordsForm").on("submit", function() {
        window.sidebarUtil.search($("#findWords").val());
        $("#findWords").val("");
        return false;
    });

    /* Triggers: Share */
    $("#email_share").on("submit", window.sidebarUtil.email_invite);
    setTimeout(window.sidebarUtil.copy_button, 1000);

    /* Triggers: Download */
    $("#downloadFile").on("click", window.sidebarUtil.downloadFile);
    $("#githubCommit").on("click", window.sidebarUtil.commitFile);
    $("#saveToServer").on("click", window.sidebarUtil.pushFile);

    /* Triggers: Settings */
    $("#password_change").on("click", window.sidebarUtil.togglePassword);
    $("#settingsSave").on("click", window.sidebarUtil.settings);

    $("#removeDoc, #actionConfirmCancel").on("click", function() {
        $("#removeConfirm").slideToggle();
    });

    $("#removeConfirmClick").on("click", window.sidebarUtil.remove);
});
