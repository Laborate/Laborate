$(function() {
    $('textarea').autosize();

    if(config.auto_pull) {
        window.newsUtil.feed(1);
        $(window).scroll(window.newsUtil.scroll);
    }
});
