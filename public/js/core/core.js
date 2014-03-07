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

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(function() {
    //Initalize Socket
    window.socketUtil.init();

    //Check For Notifications (Every Minute)
    setInterval(window.socketUtil.notifications, 60000);

    //Prevent Rewriting Of Document
    setInterval(function() {
        $("body").attr("contenteditable", "false");
    }, 500);


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

window.error = {
    open: function(message) {
        _this = window.error;
        $(".error_popup")
            .html(message)
            .vAlign()
            .hAlign()
            .fadeIn(300);

        setTimeout(_this.close, 3000);
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
        _this.socket.on("notification", _this.notification);

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
        $(".sidebar .profile .img").toggleClass("blink", notification);
    },
    notifications: function() {
        _this = window.socketUtil;
        _this.socket.emit("notifications", function(notification) {
            _this.notification(notification);
        });
    },
    onNotification: function() {
        _this = window.socketUtil;
        _this.socket.on('notifications', function (notification) {
            _this.notification(notification);
        });
    }
}

window.onpopstate = window.socketUtil.pageTrack;
window.onunload = window.socketUtil.unload;
window.onbeforeunload = window.socketUtil.unload;
