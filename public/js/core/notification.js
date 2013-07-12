//////////////////////////////////////////////////
//          Notification Instances
/////////////////////////////////////////////////
window.notification = {
    open: function(html, permanent) {
        $(".notification").html(html).hAlign().show();
        if(permanent) setTimeout(this.close, 20000);
    },
    close: function() {
        $(".notification").hide();
    }
}
