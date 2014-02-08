$.extend(window.socketUtil, {
    connect: function(reconnect) {
        if(!window.term) {
            var term_width = (Math.ceil(($(window).width() - 40)/7));
            var term_height = (Math.ceil(($(window).height() - 40)/13));

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

                window.term.open(document.body);
                $(".terminal").hAlign().vAlign();
                status(false);
            });
        }
    },
    disconnect: function(leave, reconnect) {
        if(window.term) {
            window.term.destroy();
            window.term = null;

            if(leave) {
                if(reconnect) {
                    status("Session Closed. <span>Reconnect</span>");
                } else {
                    status("Session Closed");
                }
            } else {
                status("Reconnecting...");
            }
        }
    },
    reconnect: function() {
        if(!window.term) {
            window.socketUtil.connect();

        }
    }
});

$(function() {
    //Socket Events
    window.socketUtil.socket.on("connect", window.socketUtil.connect);
    window.socketUtil.socket.on("reconnect", window.socketUtil.reconnect);
    window.socketUtil.socket.on("disconnect", window.socketUtil.disconnect);
    window.onoffline = window.socketUtil.disconnect;

    window.socketUtil.socket.on('connect_failed', function() {
        status("Failed To Connect. Retrying now...", true);
    });

    window.socketUtil.socket.on('reconnect_failed', function() {
        status("Failed To Reconnect. Retrying now...", true);
    });

    window.socketUtil.socket.on('error', function(reason) {
        Raven.captureException(reason);
        status("Failed To Connect", '/');
    });

    window.socketUtil.socket.on('terminalData', function(data) {
        window.term.write(data);
    });

    window.socketUtil.socket.on('terminalLeave', function() {
        window.socketUtil.disconnect(true, true);
    });

    var interval = setInterval(function() {
        if(window.socketUtil.socket.socket.connected) {
            clearInterval(interval);
            window.socketUtil.connect();
        }
    });

    $(".status").on("click", "span", function() {
        window.socketUtil.connect();
    });
});

$(window).on("resize", function() {
    if(window.term) {
        var term_width = (Math.ceil(($(window).width() - 40)/7));
        var term_height = (Math.ceil(($(window).height() - 40)/13));

        term.resize(term_width, term_height);
        window.socketUtil.socket.emit('terminalResize', [term_width, term_height]);
        $(".terminal").hAlign().vAlign();
    }
});

function status(message, url) {
    if(message) {
        $(".status")
            .html(message)
            .hAlign().vAlign()
            .show();
    } else {
        $(".status").hide();
    }

    if(url) {
        setTimeout(function() {
            if(url == true) {
                window.location.reload(true);
            } else {
                window.location.href = url;
            }
        }, 3000)
    }
}
