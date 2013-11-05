//////////////////////////////////////////////////
//          Account Instances
/////////////////////////////////////////////////
window.account = {
    activated: null,
    location: function(location, history) {
        $(".locations .item").removeClass("activated");
        $(".locations .item[data-key='" + location + "']").addClass("activated");
        $(".pane .selection").hide();
        $(".pane .selection[data-key='" + location + "']").show();
        if(history) window.history.pushState(null, null, "/account/" + location + "/");
        window.account.activated = location;
    }
}
