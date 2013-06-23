//Socket IO Configuration
window.nodeSocket = io.connect("/", {
    "max reconnection attempts": "Infinity",
    "sync disconnect on unload": true,
    "try multiple transports": true,
});

window.nodeSocket.on("reconnecting", function() {
    $("#editorCodeMirror").css({"opacity": ".5"});
    editor.options.readOnly = true;
    window.notification.open("Reconnecting...");
});

window.nodeSocket.on("reconnect", function() {
    window.editorUtil.join($.cookie("screenName"), $("#backdropPassword").val());
    window.notification.close();
    editor.options.readOnly = false;
    $("#editorCodeMirror").css({"opacity": ""});
});

//Url Parameters
window.url_params = function() {
    params = /\/editor\/(\d*)/.exec(window.location.href);
    params_dict = {};
    params_dict["document"] = (params) ? params[1] : null;
    return params_dict;
}


$(window).ready(function() {
    //Set Tmp User Id
    window.userId = Math.floor((Math.random()*100000000000000000)+1);

    //Set Array of Users
    window.users = new Array();

    //Set Array of User Lines
    window.cursors = new Array();
});
