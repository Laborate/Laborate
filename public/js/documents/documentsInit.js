$(window).ready(function() {
    var location = (window.url_params) ? window.url_params[1] : "online";
    window.documents.locationListing(location);
    window.documents.githubRepos();
});