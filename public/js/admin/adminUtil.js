//////////////////////////////////////////////////
//          Account Instances
/////////////////////////////////////////////////
window.admin = {
    timer: {},
    activated: null,
    location: function(location, history) {
        $(".sidebar .option").removeClass("activated");
        $(".sidebar .option[data-key='" + location + "']").addClass("activated");
        $(".main .selection").hide();
        $(".main .selection[data-key='" + location + "']").show();
        $(".notification").toggle(location != "notifications");
        if(history) window.history.pushState(null, null, "/admin/" + location + "/");
        window.socketUtil.pageTrack();
        window.admin.activated = location;
    }
}
