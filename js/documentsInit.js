var online_files = false;
var github_directories = false;
var github_repos = false;
var location_listings = false;

$(window).ready(function() {
    $("#files .notification").text("loading...").hAlign().show();
    $("#locations").css("height", ($(document).height() - 95) + "px");

    if(getUrlVars()['type'] == undefined) {
        $("#locations #online").addClass("selected");
        $("#location_online").show();
        window.sidebar = "online";
    }
    else {
        $("#files #location_template").show();
    }

    $.post("server/php/locations/online_files.php",
        function(json) {
            var files = "";
            $.each(JSON.parse(json), function(i, item) {
                var file = '<div id="file_' + item['id'] + '" class="file online" data="' + item['id'] + '">';
                file += '<div class="file_attributes ' + item['protection'] + '" data="' + item['protection'] + '">';
                file += item['ownership'];
                file += '</div>';
                file += '<div class="title" data="' + item['title'] + '">';
                file += nameToTitle(item['title']);
                file += '</div></div>';
                files += file;
            });
            $("#files #location_online #file_library").append(files);
            online_files = true
    });

    if(getUrlVars()['type'] == "github") {
        $.post("server/php/locations/github_directories.php", { location_id: getUrlVars()['loc'], dir: getUrlVars()['dir'] },
        function(json) {
            if(json == "Bad Token") {
                badToken();
                return false;
            }

            else if(json == "Bad Location") {
                $("#locations #online").addClass("selected");
                $("#location_online").show();
                window.sidebar = "online";
                return false;
            }

            else {
                window.sidebar = "" + getUrlVars()['loc'];
            }

            var files = "";
            $.each(JSON.parse(json), function(i, item) {
                if(item["type"] == "file") { var type = "file"; var icon = "open"; var type_title = "file"; }
                if(item["type"] == "dir") { var type = "folder"; var icon = "folder"; var type_title = "folder"; }
                if(item["type"] == "back") { var type = "folder"; var icon = "back"; var type_title = "back"; }

                var title = nameToTitle(item["name"]);

                var template = '<div id="github_' + item["path"] + '" class="file github" data="' + item["path"] + '">';
                template += '<div class="file_attributes ' + icon + '" data="' + type + '">' + type_title + '</div>';
                template += '<div class="title" data="' + item["name"] + '">' + title + '</div>';
                template += '</div>';
                files += template;
            });
            $("#files #location_template #file_library").html(files);
            github_directories = true;
        });
    } else {
        github_directories = true;
    }

    if($("#popup_location_github").length != 0) {
        $.post("server/php/locations/github_repos.php",
            function(json) {
                if(json == "Bad Token") {
                    badToken();
                    return false;
                }

                var repos = "";
                $.each(JSON.parse(json), function(i, item) {
                    repos += '<li>' + item['user'] + '/<span class="bold">' + item['repo'] + '</span></li>'
                });

                if(repos != "") {
                    $("#popup_location_github").append("<ul>" + repos + "</ul>");
                } else {
                    $("#popup_location_github #github_empty").show();
                }

                github_repos = true;
        });
    } else {
        github_repos = true;
    }

    $.post("server/php/locations/locations_listing.php",
        function(json) {
            var locations = "";
            $.each(JSON.parse(json), function(i, item) {
                locations += '<li id="' + item['key'] + '"><span class="icon ' + item['icon'] + '"></span>' + item['name'] + '</li>';
            });
            $("#locations ul").append(locations);
            location_listings = true;
    });
});

var initFinished = setInterval(function(){
    if(online_files && github_directories && github_repos && location_listings) {
        $("#files .notification").hide();
        $("#locations #" + window.sidebar).addClass("selected");
        clearInterval(initFinished);
    }
}, 100);
