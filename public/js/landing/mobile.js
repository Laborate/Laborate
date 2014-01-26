$(function() {
    $("#landing").hAlign();
    $("#logo")
        .vAlign()
        .hAlign()
        .css("top", "50px");
    $("#logo, #landing, #social").fadeIn(500);
});

$(window).load(function() {
    $("#backdrop-img").fadeIn(350);
})
