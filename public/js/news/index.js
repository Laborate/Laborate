$(function() {
    $(".main .container > .form").submit(function(e) {
        window.newsUtil.post($(this));
        e.preventDefault();
    });

    $(".main .container > .posts").on("submit", ".form", function(e) {
        window.newsUtil.sub_post($(this));
        e.preventDefault();
    });

    $(".main .container > .posts").on("click", ".mention", function() {
        window.newsUtil.mention($(this));
    });

    $(".main .container > .form .preview").click(function() {
        window.newsUtil.preview(!$(this).hasClass("activated"), $(this).parents(".form"));
    });

    $(".filters .groups").on("click", ".option", function() {
        window.newsUtil.group($(this));
    });
});
