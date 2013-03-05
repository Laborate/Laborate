//////////////////////////////////////////////////
//          Account Instances
/////////////////////////////////////////////////
window.account = {
    navigationChange: function(settings_id, initialize) {
        $(".settings").hide();
        $("#navigation ul li").removeClass("selected");
        $("#settings_" + settings_id).show();
        $("#navigation ul #" + settings_id).addClass("selected");
        if(settings_id == "github" && initialize) {
            window.account.githubRepos();
        }
        history.pushState(null, null, "?nav=" + settings_id);
    },
    githubRepos: function(callback) {
        window.notification.open("loading...");

        $.post("/server/php/locations/github_repos.php",
            function(json) {
                if(json == "Login Required") {
                    $("#settings_github .settings_content #need_github_login").hAlign().show();
                    window.notification.close();
                    return false;
                }

                if(json == "Bad Token") {
                    window.notification.open("Opps! Github Needs To Be <a href='/account?github=3'>Reauthorized</a>");
                    return false;
                }

                var repos = "";
                $.each(JSON.parse(json), function(i, item) {
                    if(item['private']) { var icon = "icon-locked-2"; }
                    else { var icon = "icon-unlocked"; }
                    repos += '<li class="tr">';
                    repos += '<span class="icon ' + icon + '"></span>';
                    repos += '<a href="https://github.com/' + item['user'] + '/' + item['repo'] + '">';
                    repos += item['user'] + '/<span class="bold">' + item['repo'] + '</span>';
                    repos += '</a>';
                    repos += '</li>';
                });

                if(repos != "") {
                    $("#settings_github .settings_content .table").append(repos);
                } else {
                    $("#settings_github .settings_content .table").append('<li class="tr">You Do Not Have Any Repositories</li>');
                }

                if(callback == undefined) {
                    callback = function(){}
                }

                callback(true);
                window.notification.close();
            }
        );
    }
}