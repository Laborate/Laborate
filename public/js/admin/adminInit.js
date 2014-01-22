window.url_params = function() {
    params = /\/admin\/(.*?)\//.exec(window.location.href);

    return ((params) ? {
        mode: params[1]
    } : {
        mode: "dashboard"
    });
}

$(function() {
    window.admin.location(window.url_params()["mode"], true);
    window.onpopstate = function() {
        window.admin.location(window.url_params()["mode"]);
    };
});
