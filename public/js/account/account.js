$(document).on("click", ".locations .item", function() {
    window.account.location($(this).data("key"), true);
});
