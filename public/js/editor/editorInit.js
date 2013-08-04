//Socket IO Configuration
window.nodeSocket = io.connect(window.location.origin+":"+$("#_port").text(), {
    "sync disconnect on unload": true
});

window.nodeSocket.on("reconnecting", function() {
    $("#editorCodeMirror").css({"opacity": ".5"});
    $(".backdropButton").val("Reconnecting...").attr("disabled", "disabled");
    editor.options.readOnly = true;
    window.notification.open("Reconnecting...", true);
});

window.nodeSocket.on("connect", function() {
    $(".backdropButton").val("Join Document").attr("disabled", false);
    window.notification.close();
    editor.options.readOnly = false;
    $("#editorCodeMirror").css({"opacity": ""});
});

window.nodeSocket.on("reconnect", function() {
    if(!$("#backdrop").is(":visible")) {
        window.nodeSocket.emit("editorJoin", window.editorUtil.document_hash, function(json) {
            if(json.success) {
                window.notification.close();
                editor.options.readOnly = false;
                $("#editorCodeMirror").css({"opacity": ""});
            } else {
                if(json.error_message) {
                    $("#backdrop").show();
                    $(".backdropContainer")
                        .width("300px")
                        .html(
                            $(".backdropInitalWelcome")
                                .removeClass("seperatorRequired")
                                .text(json.error_message)[0]
                        );
                } else {
                    window.location.href = "/documents/";
                }
            }
        });
    }
});

window.nodeSocket.on('connect_failed', function () {
    $("#backdrop").show();
    $(".backdropContainer")
        .width("300px")
        .html(
            $(".backdropInitalWelcome")
                .removeClass("seperatorRequired")
                .text("Failed To Connect. Retrying now...")[0]
        );
    setTimeout(function() {
        window.location.reload(true);
    }, 5000);
});

window.nodeSocket.on('reconnect_failed', function () {
    $("#backdrop").show();
    $(".backdropContainer")
        .width("300px")
        .html(
            $(".backdropInitalWelcome")
                .removeClass("seperatorRequired")
                .text("Failed To Reconnect. Retrying now...")[0]
        );
    setTimeout(function() {
        window.location.reload(true);
    }, 5000);
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
});
