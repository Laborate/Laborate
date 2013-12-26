$(function() {
    $("#landing, #social").hAlign();
    $("#logo").vAlign().hAlign();

    setTimeout(function() {
        $("#logo").fadeIn(500);
    }, 500);
});

$(window).load(function() {
    setTimeout(function() {
        $("#logo").animate({
            top: "100px",
            opacity: 0
        }, 800);

        setTimeout(function() {
            $("#landing, #social").fadeIn(500);
            $("#logo")
                .removeClass("spin")
                .animate({
                    opacity: 1
                }, 500);
        }, 1300);
    }, 1000);
})
