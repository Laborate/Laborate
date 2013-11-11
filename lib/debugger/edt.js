$(document).on("click", "#EDT-show, #EDT-close", function() {
    $("#EDT-main .object .object tbody").hide();
    $("body").css("overflow", (($("body").css("overflow") == "hidden") ? "" : "hidden"));
});
