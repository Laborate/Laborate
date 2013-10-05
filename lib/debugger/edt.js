$(document).on("click", "#EDT-show, #EDT-close", function() {
    $("body").css("overflow", (($("body").css("overflow") == "hidden") ? "" : "hidden"));
});
