//Socket IO Configuration
window.nodeSocket = io.connect("/", {
    "max reconnection attempts": "Infinity",
    "sync disconnect on unload": true,
    "try multiple transports": true,
});

window.nodeSocket.on("reconnecting", function() {
    $("#editorCodeMirror").css({"opacity": ".5"});
    editor.options.readOnly = true;
    window.notification.open("Reconnecting...", true);
});

window.nodeSocket.on("reconnect", function() {
    window.nodeSocket.emit("editorJoin", window.editorUtil.document_hash, function(json) {
        if(json.success) {
            window.notification.close();
            editor.options.readOnly = false;
            $("#editorCodeMirror").css({"opacity": ""});
        } else {
            window.location.href = "/documents/";
        }
    });
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
