$(function() {
    $(".main .container > .form").submit(function(e) {
        window.newsUtil.post($(this));
        e.preventDefault();
    });

    $(".main .container > .posts").on("submit", ".form", function(e) {
        window.newsUtil.reply($(this));
        e.preventDefault();
    });

    $(".main .container > .posts").on("click", ".like", function() {
        window.newsUtil.like($(this));
    });

    $(".main .container > .posts").on("click", ".reply-like", function() {
        window.newsUtil.reply_like($(this));
    });

    $(".main .container > .posts").on("click", ".mention", function() {
        window.newsUtil.mention($(this));
    });

    $(".main .container > .posts").on("click", ".comment", function() {
        window.newsUtil.comment($(this));
    });

    $(".main .container > .form .preview").click(function() {
        window.newsUtil.preview(!$(this).hasClass("activated"), $(this).parents(".form"));
    });

    $(".filters .groups").on("click", ".option", function() {
        window.newsUtil.group($(this));
    });

    $(".filters > .tags .form").submit(function(e) {
        window.newsUtil.tag($(this));
        e.preventDefault();
    });

    $(".filters > .tags").on("click", ".tag .remove", function() {
        window.newsUtil.tag_remove($(this).parents(".tag"));
    });
});
