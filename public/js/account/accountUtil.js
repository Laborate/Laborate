//////////////////////////////////////////////////
//          Account Instances
/////////////////////////////////////////////////
window.account = {
    navigationChange: function(mode_id, initialize) {
        $(".settings").hide();
        $("#navigation ul li").removeClass("selected");
        $("#settings_" + mode_id).show();
        $("#navigation ul #" + mode_id).addClass("selected");

        var mode = (mode_id == "profile") ? "" : mode_id + "/";
        history.pushState(null, null, "/account/" + mode);
    }
}