window.url_params = function(real) {
    params = /\/news\/tags\/([\w\d]*)/.exec(window.location.href);

    return ((params) ? {
        tags: [params[1]]
    } : {
        tags: []
    });
}

$.extend(window.socketUtil, {
    connect: function() {
       window.socketUtil.socket.emit("newsJoin");
    }
});


$(function() {
    window.socketUtil.socket.on("connect", window.socketUtil.connect);
    window.socketUtil.socket.on("reconnect", window.socketUtil.connect);
    window.socketUtil.socket.on("newsReply", window.newsUtil.new_reply);
    window.socketUtil.socket.on("newsLike", window.newsUtil.new_like);
    window.socketUtil.socket.on("newsPost", window.newsUtil.new_post);

    window.newsUtil.tags = window.url_params().tags;
    window.newsUtil.feed(1);

    window.addEventListener('popstate', function() {
        if(event.state) {
            window.newsUtil.feed(1, true);
        }
    }, false);

    $(window).scroll(window.newsUtil.scroll);
});
