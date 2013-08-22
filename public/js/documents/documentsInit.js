//Url Parameters
window.url_params = function() {
    params = /\/documents\/([\w\d]{10})\/(.*)/.exec(window.location.href);
    params_dict = {};

    if(params) {
        params_dict["location"] = params[1];
        params_dict["dir"] = params[2];
    } else {
        params_dict["location"] = "online";
        params_dict["dir"] = "";
    }
    return params_dict;
}

$(window).ready(function() {
    window.documents.locationChange(window.url_params()["location"], window.url_params()["dir"], true);
    window.documents.locationListing(window.url_params()["location"]);
    window.documents.githubRepos();
});
