$("#EDT-show, #EDT-close").live("click", function() {
    $("body").css("overflow", ($("body").css("overflow")) ? "hidden":"");
});
