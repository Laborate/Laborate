//Socket IO Configuration
window.nodeSocket = io.connect(window.location.origin+":"+$("#_port").text(), {
    "sync disconnect on unload": true
});

window.nodeSocket.on("reconnecting", function() {
    $("#editorCodeMirror").css({"opacity": ".5"});
    editor.options.readOnly = true;
    window.notification.open("Reconnecting...", true);
    editor.setValue(editor.getValue() + "\nLost Connection: " + new Date().toLocaleTimeString())
});

window.nodeSocket.on("reconnect", function() {
    window.nodeSocket.emit("editorJoin", window.editorUtil.document_hash, function(json) {
        if(json.success) {
            window.notification.close();
            editor.options.readOnly = false;
            $("#editorCodeMirror").css({"opacity": ""});
            editor.setValue(editor.getValue() + "\nRegained Connection: " + new Date().toLocaleTimeString())
        } else {
            if(error.message) {
                $("#backdrop").show();
                $(".backdropContainer").css("text-align", "center").text(error.message);
            } else {
                window.location.href = "/documents/";
            }
        }
    });
});

window.nodeSocket.on('connect_failed', function () {
    window.location.reload(true);
});

window.nodeSocket.on('reconnect_failed', function () {
    window.location.reload(true);
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
