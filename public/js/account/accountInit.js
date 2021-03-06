window.url_params = function() {
    params = /\/account\/(.*?)\//.exec(window.location.href);

    return ((params) ? {
        mode: params[1]
    } : {
        mode: "dashboard"
    });
}

$(function() {
    $('#card').payment('formatCardNumber');
    $('#expiration').payment('formatCardExpiry');
    $('#cvc').payment('formatCardCVC');
    window.account.location(window.url_params()["mode"], true);
    window.onpopstate = function() {
        window.account.location(window.url_params()["mode"]);
    };
});
