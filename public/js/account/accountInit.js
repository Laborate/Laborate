window.url_params = function() {
    params = /\/account\/(.*?)\//.exec(window.location.href);

    return ((params) ? {
        mode: params[1]
    } : {
        mode: "profile"
    });
}

$(function() {
    $('#card').payment('formatCardNumber');
    $('#expiration').payment('formatCardExpiry');
    $('#cvc').payment('formatCardCVC');
    window.account.location(window.url_params()["mode"], true);
});
