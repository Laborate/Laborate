window.url_params = function() {
    params = /\/account\/(.*?)\//.exec(window.location.href);

    return ((params) ? {
        mode: params[1]
    } : {
        mode: "profile"
    });
}

$(window).ready(function() {
    window.account.navigationChange(window.url_params()["mode"], true);
});
