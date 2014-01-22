$(function() {
    var hover = false;
    $(".user")
        .hover(function() {
            hover = true;

            $(".tooltip .text")
                .text($(this).attr("data-name"))
                .parents(".tooltip")
                .css({
                    top: $(this).position().top + $(this).outerHeight(true) + 8,
                    left: $(this).position().left + ($(this).width()/2) - ($(".tooltip").outerWidth(true)/2)
                })
                .fadeIn(200);
        })
        .mouseleave(function() {
            hover = false;
            setTimeout(function() {
                if(!hover) {
                    $(".tooltip").fadeOut(200);
                }
            }, 100);
        });
})
