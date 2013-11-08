$(function() {
    $(document).on("click", ".locations .item", function() {
        window.account.location($(this).data("key"), true);
    });

    $(document).on("submit", ".pane form", function() {
        window.account.locationSubmit($(this));
        return false;
    });

    $(document).on("click", ".pane #locations .remove", function() {
        window.account.locationRemove($(this).parents(".item"));
    });

    $(document).on("click", ".pane #credit-cards .remove", function() {
        window.account.cardRemove($(this).parents(".item"));
    });

    $(document).on("keyup", ".pane #card", window.account.cardType);
});
