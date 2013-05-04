//////////////////////////////////////////////////
//          Notification Instances
/////////////////////////////////////////////////
window.notification = {
    open: function(html) {
        $(".notification").html(html).hAlign().show();
    },
    close: function() {
        $(".notification").hide();
    }
}