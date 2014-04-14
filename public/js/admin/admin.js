$(function() {
    $(document).on("click", ".sidebar .option", function() {
        window.admin.location($(this).data("key"), true);
    });

    $(document).on("click", ".notification .close", function() {
        window.account.notificationClose($(this).parents(".notification"));
    });
});
