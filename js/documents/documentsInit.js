var initialCheckList = {
    "online_directory": false,
    "sftp_directory": false,
    "github_directory": false,
    "github_repos": false,
    "location_listings": false,
};

$(window).ready(function() {
    window.notification.open("loading...");
    window.documents.locationChange(getUrlVars()['loc'], false);


    if(getUrlVars()['type'] == undefined) {
        window.documents.onlineDirectory(true, function(callback) {
            initialCheckList['online_directory'] = callback;
        });
    } else {
        initialCheckList['online_directory'] = true;
    }

    window.documents.locationListing(function(callback) {
        initialCheckList['location_listings'] = callback;
    });

    if(getUrlVars()['type'] == "github") {
        window.documents.githubDirectory(getUrlVars()['loc'], getUrlVars()['dir'], false,
            function(callback) {
                initialCheckList['github_directory'] = callback;
            }
        );
    } else {
        initialCheckList['github_directory'] = true;
    }

    if(getUrlVars()['type'] == "sftp") {
        window.documents.sftpDirectory(getUrlVars()['loc'], getUrlVars()['dir'], false,
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
        $("#locations #" + window.sidebar).addClass("selected");
        window.notification.close();
        clearInterval(initFinished);
    }
}, 100);
