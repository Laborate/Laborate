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
    }
}