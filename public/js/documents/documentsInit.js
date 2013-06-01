$(window).ready(function() {
    window.notification.open("loading...");
    var location_parts = /\/documents\/location\/(\d*)\/(.*)/.exec(window.location.href)
    var location = (location_parts) ? [location_parts[1], location_parts[2]]  : ["online", ""];

    window.documents.locationChange(location[0], location[1]);
    window.documents.locationListing(location[0]);
    window.documents.githubRepos();
});