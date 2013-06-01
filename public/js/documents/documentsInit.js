$(window).ready(function() {
    window.documents.locationListing(window.url_params()["location"]);
    window.documents.githubRepos();
});