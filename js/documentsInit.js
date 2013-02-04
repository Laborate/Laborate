var online_directory = false;
var github_directory = false;
var github_repos = false;
var location_listings = false;

$(window).ready(function() {
    window.documents.notification("loading...");
    window.documents.locationsHeight();
    window.documents.locationChange(getUrlVars()['loc'], true);

    window.documents.onlineDirectory(function(callback) {
        online_directory = callback;
    });

    window.documents.locationListing(function(callback) {
        location_listings = callback;
    });

    if(getUrlVars()['type'] == "github") {
        window.documents.githubDirectory(getUrlVars()['loc'], getUrlVars()['dir'],
            function(callback) {
                github_directory = callback;
            }
        );
    } else {
        github_directory = true;
    }

    if($("#popup_location_github").length != 0) {
        window.documents.githubRepos(function(callback) {
            github_repos = callback;
        });
    } else {
        github_repos = true;
    }
});

var initFinished = setInterval(function(){
    if(online_directory && github_directory && github_repos && location_listings) {
        window.documents.notificationClose();
        $("#locations #" + window.sidebar).addClass("selected");
        clearInterval(initFinished);
    }
}, 100);
