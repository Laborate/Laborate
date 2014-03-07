$.extend(window.socketUtil, {
    connect: function(reconnect) {
        if(!window.term) {
            resize(function(width, height) {
                window.socketUtil.socket.emit("terminalJoin", [width, height], function() {
                    window.term = new Terminal({
                        cols: width,
                        rows: height,
                        useStyle: true,
                        screenKeys: true
                    });

                    window.term.on('data', function(data) {
                        window.socketUtil.socket.emit('terminalData', data);
                    });

                    window.term.open($(".container").get(0));
                    status(false);
                });
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
    //Terminal Colors
    window.Terminal.defaults.colors[256] = 'transparent';

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

    $(".toggle").click(function() {
        toggleBackground(!$(this).hasClass("active"));
    });
});

$(window).on("resize", resize);

function resize(callback) {
    var width = (Math.ceil(($(window).width() - 40)/7));
    var height = (Math.ceil(($(window).height() - $(".header").height() - 40)/13));

    if(window.term) {
        term.resize(width, height);
        window.socketUtil.socket.emit('terminalResize', [width, height]);
    }

    if(typeof callback == "function") {
        callback(width, height);
    }
}

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

function toggleBackground(show) {
    $.cookie("background", show, {
        path: '/terminals',
        expires: 365
    });

    $(".header, .error_popup").removeClass("lighten darken");
    $(".header, .error_popup").addClass((show) ? "lighten" : "darken");
    $(".toggle").toggleClass("active", show);

    if(show) {
        $(".backdrop").fadeIn();
    } else {
        $(".backdrop").fadeOut();
    }
}
