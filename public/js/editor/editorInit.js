window.socketUtil = {
    socket: io.connect(window.config.host+":"+window.config.port, {
        "sync disconnect on unload": true
    }),
    connect: function() {
        $(".backdropButton").val("Join Document").attr("disabled", false);
        window.notification.close();
        if(window.editor) {
            window.editor.options.readOnly = false;
        }
        $("#editorCodeMirror").css({"opacity": ""});
    },
    disconnect: function() {
        if(!window.unload) {
            $("#editorCodeMirror").css({"opacity": ".5"});
            $(".backdropButton").val("Reconnecting...").attr("disabled", "disabled");
            if(window.editor) {
                window.editor.options.readOnly = true;
            }
            window.notification.open("Reconnecting...", true);
            window.editorUtil.users([]);
            $("title").text([
                $("title").text().split(window.config.delimeter)[0],
                "Reconnecting"
            ].join(window.config.delimeter));
        }
    },
    reconnect: function() {
        window.socketUtil.connect();
        if(!$("#backdrop").is(":visible")) {
            window.editorUtil.join(window.editorUtil.access_token, true, window.socketUtil.connect);
            $("title").text([
                $("title").text().split(window.config.delimeter)[0],
                window.config.name
            ].join(window.config.delimeter));
        }
    },
    unload: function() {
        window.unload = true;
    }
}

//Socket Events
window.socketUtil.socket.on("connect", window.socketUtil.connect);
window.socketUtil.socket.on("reconnect", window.socketUtil.reconnect);
window.socketUtil.socket.on("reconnecting", window.socketUtil.disconnect);
window.socketUtil.socket.on("disconnect", window.socketUtil.disconnect);
window.onoffline = window.socketUtil.disconnect;
window.onbeforeunload = window.socketUtil.unload;
window.onunload = window.socketUtil.unload;

window.socketUtil.socket.on('connect_failed', function () {
    window.backdrop.error("Failed To Connect. Retrying now...", true);
});

window.socketUtil.socket.on('reconnect_failed', function () {
    window.backdrop.error("Failed To Reconnect. Retrying now...", true);
});

window.socketUtil.socket.on('error', function (reason){
    window.backdrop.error(reason, true);
});

//Url Parameters
window.url_params = function() {
    params = /\/editor\/(\d*)/.exec(window.location.href);
    params_dict = {};
    params_dict["document"] = (params) ? params[1] : null;
    return params_dict;
}

$(window).ready(function() {
    //Set Array of Users
    window.users = new Array();

    //Set Title
    window.sidebarUtil.setTitle("in", $("#document_title").text());

    //Refresh Editor
    window.editorUtil.refresh();
});
