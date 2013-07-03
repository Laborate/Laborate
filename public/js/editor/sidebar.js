$(window).ready(function() {
    /* Core Operations */
    $("#sidebar_header img").live("click", function() {
        window.sidebarUtil.change($(this).attr("id"), "");
    });

    $("#sidebar #sidebar_header img").live("click mousedown", function() {
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
});
