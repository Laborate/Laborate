$(document).on("click", ".locations .item", function() {
    window.account.location($(this).data("key"), true);
});

$(document).on("submit", ".pane form", function() {
    window.account.locationSubmit($(this));
    return false;
});

$(document).on("click", ".pane .remove", function() {
    window.account.locationRemove($(this).parents(".item"));
    return false;
});
