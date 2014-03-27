Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.shuffle = function() {
    var o = this;
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

Array.prototype.intersections = function(b) {
    return $(this).filter(b).get();
}

Array.prototype.__defineGetter__("empty", function() {
    return this.length == 0;
});

Array.prototype.end = function(index) {
    return (this.length - 1) == index;
};

JSON.cycle = function(data) {
    return JSON.parse(JSON.stringify(data));
}

String.prototype.__defineGetter__("capitalize", function() {
    return $.map(this.split(" "), function(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }).join(" ");
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(function() {
    //Initalize Socket
    window.socketUtil.init();

    //Check If Notifications Are Enabled
    window.notifications.init();

    //Check For Notifications (Every Minute)
    setInterval(window.socketUtil.notifications, 60000);

    //Prevent Rewriting Of Document
    setInterval(function() {
        $("body").attr("contenteditable", "false");
    }, 500);

    //Auto Center Module
    $(".module")
        .vAlign()
        .hAlign();

    //AutoGrow Textarea
    $('textarea.autogrow').autosize();

    //Set Original Value
    $(".button").each(function() {
        $(this).attr({
            "data-original": $(this).val(),
            "data-original-class": $(this).attr("class")
        });
    });

    //Setup Jscroll
    $(".scroll-pane").each(function() {
		var _this = $(this);

		_this.jScrollPane({
			showArrows: false,
    	    animateScroll: true,
    	    autoReinitialise: true,
    	    hideFocus: true
		});

		if(_this.parent('.pane').length) {
		    $(".pane .scroll-pane").css("height", function() {
                return $(window).height() - $(".header").height();
            }());
		}

		var api = _this.data('jsp');
		var throttleTimeout;
		$(window).bind('resize', function() {
			// IE fires multiple resize events while you are dragging the browser window which
			// causes it to crash if you try to update the scrollpane on every one. So we need
			// to throttle it to fire a maximum of once every 50 milliseconds...
			if (!throttleTimeout) {
				throttleTimeout = setTimeout(function() {
					api.reinitialise();
					throttleTimeout = null;
                }, 50);
			}

			if(_this.parent('.pane').length) {
    		   _this.css("height", function() {
                    return $(window).height() - $(".header").height();
                }());
    		}
        });
    });
});

window.notifications = {
    enabled: false,
    notifications: window.webkitNotifications,
    init: function() {
        var _this = window.notifications;

        if(_this.notifications && _this.notifications.checkPermission() == 1) {
    	    _this.notifications.requestPermission(function() {
                _this.enabled = (_this.notifications.checkPermission() == 0);
    	    });
        } else {
            _this.enabled = (_this.notifications.checkPermission() == 0);
        }
    },
    message: function(message, title, icon) {
        var _this = window.notifications;

        if(_this.enabled) {
            _this.notifications.createNotification(
                icon || config.logo,
                title || config.name,
                message
            ).show();
        }
    }
}

window.error = {
    timer: null,
    open: function(message) {
        _this = window.error;
        $(".error_popup")
            .html(message)
            .vAlign()
            .hAlign()
            .fadeIn(300);

        if(_this.timer) clearTimeout(_this.timer);
        _this.timer = setTimeout(_this.close, 3000);
    },
    close: function() {
        $(".error_popup").fadeOut(300);
    }
}

window.socketUtil = {
    socket: null,
    init: function() {
        _this = window.socketUtil;

        _this.socket = io.connect(window.config.socket, {
            "sync disconnect on unload": true
        });

        _this.socket.on("connect", _this.load);
        _this.socket.on("reconnect", _this.load);

        _this.notifications();
        _this.onNotification();
    },
    load: function() {
        _this = window.socketUtil;
        _this.join();
        _this.pageTrack();
    },
    unload: function() {
      window.unload = true;
      window.socketUtil.socket.socket.disconnect();
    },
    join: function() {
        _this = window.socketUtil;
        _this.socket.emit("join");
    },
    pageTrack: function() {
        if(config.pageTrack) {
            window.socketUtil.socket.emit("pageTrack", window.location.href);
        }
    },
    notification: function(notification) {
        //Remove After Migration
        $(".sidebar .profile .img").toggleClass("blink", notification);
        $(".header .notifications").toggleClass("activated", notification);
    },
    notifications: function() {
        _this = window.socketUtil;
        _this.socket.emit("notifications", function(notification) {
            _this.notification(notification);
        });
    },
    onNotification: function() {
        _this = window.socketUtil;
        _this.socket.on('notification', function(notification) {
            _this.notification(notification);
            window.notifications.message(notification);
        });
    }
}

window.onpopstate = window.socketUtil.pageTrack;
window.onunload = window.socketUtil.unload;
window.onbeforeunload = window.socketUtil.unload;
