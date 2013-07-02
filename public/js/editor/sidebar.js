$(window).ready(function() {
    /* Core Operations */
    $("#sidebar_header img").live("click", function() {
        window.sidebarUtil.change($(this).attr("id"), "");
    });

    $("#sidebar #sidebar_header img").live("click mousedown", function() {
        return false;
    });

    /* Triggers: Documents */
    $("#document_undo").on("click", window.editor.undo);
    $("#document_redo").on("click", window.editor.redo);
    $("#document_format").on("click", window.sidebarUtil.format);
});
