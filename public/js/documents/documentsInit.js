//Url Parameters
window.url_params = function(real) {
    params = /\/documents\/([\w\d]*?)\/(.*)/.exec(window.location.href);

    return ((params) ? {
        location: params[1],
        dir: params[2]
    } : {
        location: (real) ? "" : "online",
        dir: ""
    });
}

$(function() {
    //Show Sidebar Counter
    $(".sidebar .info").show();

    //Update Location On History Change and Every 2 Minutes
    window.onpopstate = window.documents.locationReload;
    setInterval(window.documents.locationReload, 120000);

    //Pull Data For The First Time
    window.documents.locations(function() {
        window.documents.location(window.url_params()["location"], window.url_params()["dir"], false);
    });
});
