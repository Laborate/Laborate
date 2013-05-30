var initialCheckList = {
    "online_directory": false,
    "location_directory": false,
    "github_repos": false,
    "location_listings": false,
};

$(window).ready(function() {
    window.notification.open("loading...");
    location_parts = /\/documents\/location\/(\d*)\/(.*)/.exec(window.location.href)
    if(location_parts) window.documents.locationChange(location_parts[1], true);

    window.documents.locationListing(function(callback) {
        initialCheckList['location_listings'] = callback;
    });

    if(location_parts) {
       window.documents.locationDirectory(location_parts[1], location_parts[2], false,
            function(callback) {
                initialCheckList['location_directory'] = callback;
            }
        );
        initialCheckList['online_directory'] = true;
    } else {
        window.documents.onlineDirectory(false, function(callback) {
            initialCheckList['online_directory'] = callback;
        });
        initialCheckList['location_directory'] = true;
    }

    if($("#popup_location_github").length != 0) {
        window.documents.githubRepos(function(callback) {
            initialCheckList['github_repos'] = callback;
        });
    } else {
        initialCheckList['github_repos'] = true;
    }
});

var initFinished = setInterval(function(){
    var passed = true;
    $.each(initialCheckList, function( key, value ) {
        if(value != true) {
            passed = false;
        }
    });

    if(passed) {
        $("#locations #" + window.sidebar).addClass("selected");
        window.notification.close();
        clearInterval(initFinished);
    }
}, 100);
