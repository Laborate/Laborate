$.extend(window.socketUtil, {
    connect: function() {
        if(!window.term) {
            window.term = {};

            var term_width = (Math.ceil(($(window).width() - 60)/7));
            var term_height = (Math.ceil(($(window).height() - 60)/13));

            window.socketUtil.socket.emit("terminalJoin", [term_width, term_height], function() {
                window.term = new Terminal({
                    cols: term_width,
                    rows: term_height,
                    useStyle: true,
                    screenKeys: true
                });

                window.term.on('data', function(data) {
                    window.socketUtil.socket.emit('terminalData', data);
                });

                window.socketUtil.socket.on('terminalData', function(data) {
                    window.term.write(data);
                });

                window.term.open(document.body);
                $(".terminal").hAlign().vAlign();
            });
        }
    },
    disconnect: function() {
        if(window.term) {
            window.term.destroy();
            window.term = {};
        }
    },
    reconnect: function() {
        window.socketUtil.connect();
        console.log("reconnect");
    }
});

$(function() {
    window.socketUtil.socket.on("connect", window.socketUtil.connect);
    window.socketUtil.socket.on("reconnect", window.socketUtil.reconnect);
    window.socketUtil.socket.on("disconnect", window.socketUtil.disconnect);
});

$(window).on("resize", function() {
    term.resize(
        (Math.ceil(($(window).width() - 60)/7)),
        (Math.ceil(($(window).height() - 60)/13))
    );

    $(".terminal").hAlign().vAlign();
});
