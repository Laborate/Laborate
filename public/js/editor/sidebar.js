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
});
