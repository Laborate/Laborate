var initialCheckList = {
    "online_directory": false,
    "sftp_directory": false,
    "github_directory": false,
    "github_repos": false,
    "location_listings": false,
};

$(window).ready(function() {
    window.documents.notification("loading...");
    window.documents.locationsHeight();
    window.documents.locationChange(getUrlVars()['loc'], true);

    window.documents.onlineDirectory(function(callback) {
        initialCheckList['online_directory'] = callback;
    });

    window.documents.locationListing(function(callback) {
        initialCheckList['location_listings'] = callback;
    });

    if(getUrlVars()['type'] == "github") {
        window.documents.githubDirectory(getUrlVars()['loc'], getUrlVars()['dir'],
            function(callback) {
                initialCheckList['github_directory'] = callback;
            }
        );
    } else {
        initialCheckList['github_directory'] = true;
    }

    if(getUrlVars()['type'] == "sftp") {
        window.documents.sftpDirectory(getUrlVars()['loc'], getUrlVars()['dir'],
            function(callback) {
                initialCheckList['sftp_directory'] = callback;
            }
        );
    } else {
        initialCheckList['sftp_directory'] = true;
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
        window.documents.notificationClose();
        $("#locations #" + window.sidebar).addClass("selected");
        clearInterval(initFinished);
    }
}, 100);
