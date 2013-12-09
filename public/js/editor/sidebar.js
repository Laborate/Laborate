$(function() {
    /* Core Operations */
    $(".sidebar .list .item").on("click", function() {
        window.sidebarUtil.change($(this).attr("data-key"), false);
    });

    $(".sidebar .back").on("click", function() {
        window.sidebarUtil.change(false);
    });

    $(".search form, .sidebar form").on("submit", function() {
        window.sidebarUtil.submit($(this));
        return false;
    });

    $(".sidebar .form[name='settings'] select[name='security']").on("change", function() {
        window.sidebarUtil.togglePassword($(this).val() == "false");
    });

    $(".sidebar .form[name='type-mode'] select").on("change", function() {
        $(this).parents("form").submit();
    });

    $(".sidebar .form[name='highlight-line'] .listing").on("click", ".remove", function() {
        window.sidebarUtil.highlightRemove($(this).parents(".item").attr("data-lines"));
    });
});
