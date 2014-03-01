$(function() {
    $(".main .container > .form").submit(function(e) {
        window.newsUtil.post($(this));
        e.preventDefault();
    });

    $(".main .container > .form .preview").click(function() {
        window.newsUtil.preview(!$(this).hasClass("activated"), $(this).parents(".form"));
    });

    $(".filters .groups").on("click", ".option", function() {
        window.newsUtil.group($(this));
    });
});
