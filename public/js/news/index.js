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
        window.newsUtil.like($(this), false);
    });

    $(".main .container > .posts").on("click", ".reply-like", function() {
        window.newsUtil.like($(this), true);
    });

    $(".main .container > .posts").on("click", ".mention", function() {
        window.newsUtil.mention($(this));
    });

    $(".main .container > .posts").on("click", ".share", function() {
        window.newsUtil.share($(this));
    });

    $(".main .container").on("click", ".share_popup img", function() {
        window.newsUtil.social($(this));
    });

    $(".main .container").on("click", ".share_popup input", function() {
        $(this).select();
    });

    $(".main .container").on("click", ".share_popup", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $(".main .container > .form .preview").click(function() {
        window.newsUtil.preview(!$(this).hasClass("activated"), $(this).parents(".form"));
    });

    $(".filters .groups").on("click", ".option", function() {
        window.newsUtil.groups($(this));
    });

    $(".filters > .tags .form").submit(function(e) {
        window.newsUtil.tag($(this));
        e.preventDefault();
    });

    $(".filters > .tags").on("click", ".tag .remove", function() {
        window.newsUtil.tag_remove($(this).parents(".tag"));
    });

    $("body").on("click", "*", window.newsUtil.share_close);
});
