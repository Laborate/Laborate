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

    window.onpopstate = function() {
        if(window.newsUtil.page != 0) {
            var group = /.*\?group=(.*)/g.exec(window.location.href);
            window.newsUtil.group = (group) ? group[1] : null;
            window.newsUtil.groups($(".filter.groups .option[data-id=" + window.newsUtil.group + "]"));
        }
    }

    if(config.auto_pull != false) {
        window.newsUtil.feed(1);

        window.addEventListener('popstate', function() {
            if(event.state) {
                window.newsUtil.feed(1, true);
            }
        }, false);

        $(window).scroll(window.newsUtil.scroll);
    }

    $(".filter.groups .option[data-id=" + config.group + "]").addClass("activated");
});
