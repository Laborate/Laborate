$(function() {
    $(document).on("click", ".list .item", function() {
        window.admin.location($(this).data("key"), true);
    });

    $(document).on("click", ".notification .close", function() {
        window.account.notificationClose($(this).parents(".notification"));
    });

    $(document).on("submit", "#search", function() {
        window.admin.fileSearch($(this).find("input").val());
        return false;
    });
});
