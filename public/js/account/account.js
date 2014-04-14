$(function() {
    $(document).on("click", ".sidebar .option", function() {
        window.account.location($(this).data("key"), true);
    });

    $(document).on("submit", ".main form", function() {
        window.account.locationSubmit($(this));
        return false;
    });

    $(document).on("click", ".main #locations .remove", function() {
        window.account.locationRemove($(this).parents(".item"));
    });

    $(document).on("click", ".main #credit-cards .remove", function() {
        window.account.cardRemove($(this));
    });

    $(document).on("keyup", ".main #card", window.account.cardType);

    $(document).on("click", ".main #plans .button.clickable", function() {
        window.account.planChange($(this).parents(".item"));
    });

    $(document).on("click", ".notification .close", function() {
        window.account.notificationClose($(this).parents(".notification"));
    });

    $(document).on("click", ".main #notifications .priority", function() {
        window.account.notificationPriority($(this).parents(".item"));
    });

    $(document).on("click", ".main #notifications .remove", function() {
        window.account.notificationRemove($(this).parents(".item"));
    });
});
