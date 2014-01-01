$.extend(window.socketUtil, {
    connect: function() {
        $(function() {
            $("#backdrop input[type='submit']")
                .val("Join Document")
                .attr("disabled", false);

            window.backdrop.button = "Join Document";
            window.editorUtil.notification(false);
            if(window.editor) window.editor.options.readOnly = false;
            $(".pane").css({"opacity": ""});
        });
    },
    disconnect: function() {
        if(!window.unload) {
            $(".pane").css({"opacity": ".5"});
            $("#backdrop input[type='submit']").val("reconnecting...").attr("disabled", "disabled");
            window.editorUtil.notification("Reconnecting...", true);
            if(window.editor) window.editor.options.readOnly = true;
            window.editorUtil.users([]);
            $("title").text([
                $("title").text().split(window.config.delimeter)[0],
                "Reconnecting"
            ].join(window.config.delimeter));
        }
    },
    reconnect: function() {
        window.socketUtil.connect();
        $("title").text([
            $("title").text().split(window.config.delimeter)[0],
            window.config.name
        ].join(window.config.delimeter));
        if(!$("#backdrop").is(":visible")) {
            window.editorUtil.join(true, window.socketUtil.connect);
        }
    },
    unload: function() {
        window.unload = true;
        window.socketUtil.socket.disconnect();
    }
});

//Url Parameters
window.url_params = function() {
    params = /\/editor\/(.*?)\//.exec(window.location.href);
    params_dict = {};
    params_dict["document"] = (params) ? params[1] : null;
    return params_dict;
}

$(function() {
    //Socket Events
    window.socketUtil.socket.on("connect", window.socketUtil.connect);
    window.socketUtil.socket.on("reconnect", window.socketUtil.reconnect);
    window.socketUtil.socket.on("reconnecting", window.socketUtil.disconnect);
    window.socketUtil.socket.on("disconnect", window.socketUtil.disconnect);
    window.onoffline = window.socketUtil.disconnect;
    window.onbeforeunload = window.socketUtil.unload;
    window.onunload = window.socketUtil.unload;

    window.socketUtil.socket.on('connect_failed', function() {
        window.backdrop.error("Failed To Connect. Retrying now...", true);
    });

    window.socketUtil.socket.on('reconnect_failed', function() {
        window.backdrop.error("Failed To Reconnect. Retrying now...", true);
    });

    window.socketUtil.socket.on('error', function(reason) {
        Raven.captureException(reason);
        window.backdrop.error("Failed To Connect. Retrying now...", true);
    });

    var interval = setInterval(function() {
        if(window.socketUtil.socket.socket.connected) {
            clearInterval(interval);
            window.socketUtil.connect();
        }
    })

    //Set Array of Users
    window.users = new Array();

    //Refresh Editor
    window.editorUtil.resize();

    //Setup Fullscreen
    if($.cookie("fullscreen") != null) {
        window.editorUtil.fullscreen($.cookie("fullscreen") == "false");
    }

    //Start Joining Proccess
    window.editorUtil.join();
});
