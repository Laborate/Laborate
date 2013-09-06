//Url Parameters
window.url_params = function() {
    params = /\/documents\/([\w\d]{10})\/(.*)/.exec(window.location.href);

    return ((params) ? {
        location: params[1],
        dir: params[2]
    } : {
        location: "online",
        dir: ""
    });
}

$(window).ready(function() {
    //Update Location On History Change and Every 2 Minutes
    window.onpopstate = window.documents.locationReload;
    setInterval(window.documents.locationReload, 120000);

    //Pull Data For The First Time
    window.documents.locationChange(window.url_params()["location"], window.url_params()["dir"], true);
    window.documents.locationListing(window.url_params()["location"]);
    window.documents.githubRepos();
});
