window.url_params = function() {
    params = /\/account\/(.*?)\//.exec(window.location.href);
    params_dict = {};
    if(params) {
        params_dict["mode"] = params[1];
    } else {
        params_dict["mode"] = "profile";
    }

    return params_dict;
}

$("#navigation ul li").live("click", function() {
    window.account.navigationChange($(this).attr("id"));
});