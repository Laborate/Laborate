$.extend(window.socketUtil, {
    connect: function() {
       window.socketUtil.socket.emit("newsJoin");
    }
});


$(function() {
    $('textarea').autosize();

    window.socketUtil.socket.on("connect", window.socketUtil.connect);
    window.socketUtil.socket.on("reconnect", window.socketUtil.connect);
    window.socketUtil.socket.on("newsReply", window.newsUtil.new_reply);
    window.socketUtil.socket.on("newsLike", window.newsUtil.new_like);

    if(config.auto_pull) {
        window.newsUtil.feed(1);
        $(window).scroll(window.newsUtil.scroll);
        window.socketUtil.socket.on("newsPost", window.newsUtil.new_post);
        window.addEventListener('popstate', function() {
            if(event.state) {
                window.newsUtil.feed(1, true);
            }
        }, false);
    }
});
