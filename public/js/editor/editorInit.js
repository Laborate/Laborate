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
            window.editorUtil.join(window.socketUtil.connect);
        }
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

    window.socketUtil.socket.on('connect_failed', function() {
        window.editorUtil.error("Failed To Connect. Retrying now...", true);
    });

    window.socketUtil.socket.on('reconnect_failed', function() {
        window.editorUtil.error("Failed To Reconnect. Retrying now...", true);
    });

    window.socketUtil.socket.on('error', function(reason) {
        Raven.captureException(reason);
        window.editorUtil.error("Failed To Connect", '/');
    });

    var interval = setInterval(function() {
        if(window.socketUtil.socket.socket.connected) {
            clearInterval(interval);
            window.socketUtil.connect();
        }
    })

    //Set Array of Users
    window.users = new Array();

    if(!config.embed) {
        //Setup Fullscreen
        if($.cookie("fullscreen") != null) {
            window.editorUtil.fullscreen($.cookie("fullscreen") == "true");
        }

        //Check Fullscreen
        if($(window).width() < 1100) {
            window.editorUtil.fullscreen(true);
        }

        $.get("/editor/" + url_params()["document"] + "/permissions/", function(response) {
            //Ser Permissions
            window.config.permissions = $.map(response.permissions, function(permission) {
                return permission.name;
            });

            //Set Permission Popup
            $(".context-menu .list").append(
                $.map(response.permissions.slice(1), function(permission) {
                    return ('                                               \
                        <div class="item" data-id="' + permission.id + '">  \
                            ' + permission.name + '                         \
                        </div>                                              \
                    ');
                })
            );

            //Init Joining
            window.editorUtil.join();
        });
    } else {
        //Init Joining
        window.editorUtil.join();
    }
});
