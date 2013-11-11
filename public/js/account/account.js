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

    $(document).on("click", ".pane #plans .button.clickable", function() {
        window.account.planChange($(this).parents(".item"));
    });

    $(document).on("click", ".notification .close", function() {
        window.account.notificationClose($(this).parents(".notification"));
    });

    $(document).on("click", ".pane #notifications .remove", function() {
        window.account.notificationRemove($(this).parents(".item"));
    });
});
