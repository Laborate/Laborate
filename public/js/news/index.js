$(function() {
    $('textarea').autosize();

    $(".filters .groups").on("click", ".option", function() {
        $(this).toggleClass("activated");
    });
});

$(window).scroll(function() {
   var bottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 20);
   $(".loader").toggleClass("activated", bottom);
});
