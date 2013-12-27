$(function() {
    $("#landing").hAlign();
    $("#logo").vAlign().hAlign();

    if(config.animate) {
        setTimeout(function() {
            $("#logo").fadeIn(500);
        }, 500);
    } else {
        var mobile = $("body").hasClass("mobile");
        $("#logo").css("top", ((mobile) ? "50px" : "100px"));
        $("#logo, #landing, #social").fadeIn(500);
    }
});

$(window).load(function() {
    if(config.animate) {
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
    }
})
