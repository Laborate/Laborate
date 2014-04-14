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

    //Initalize User Groups PopUp
    window.groups.init();

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

    //Coming Soon Popup
    $("body").on("click submit", ".coming-soon", function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.error.open("Coming Soon...");
    });
});

window.notifications = {
    enabled: false,
    notifications: window.webkitNotifications,
    init: function() {
        var _this = window.notifications;

        if(_this.notifications) {
            if(_this.notifications.checkPermission() == 1) {
        	    _this.notifications.requestPermission(function() {
                    _this.enabled = (_this.notifications.checkPermission() == 0);
        	    });
            } else {
                _this.enabled = (_this.notifications.checkPermission() == 0);
            }
        } else {
            _this.enabled = false;
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

window.groups = {
    init: function() {
        var _this = window.groups;

        $("body").on("click", "div.add-groups:not(.disabled)", function() {
             _this.open($(this));
        });

         $("body").on("click", ".popup-groups .item", function() {
             _this.toggle($(this));
        });

        $("body").on("click", ".popup-groups", function(e) {
             e.stopPropagation();
        });

        $("body").click(function() {
             _this.close();
        });
    },
    open: function(button) {
        $.get("/groups/popup/" + button.attr("data-user") + "/", function(data) {
            if(typeof data != "object") {
                var popup = $(data);
                var container = $(".main .container, #backdrop-container");
                var offset = button.offset();
                var offset_container = container.offset();

                container.append(popup);

                popup
                    .fadeIn(300)
                    .css({
                        top: (offset.top - offset_container.top + (button.outerHeight(true)/2) - (popup.outerHeight(true)/2)),
                        left: (offset.left - offset_container.left + button.outerWidth(true) + 15)
                    });

            } else if(!data.success) {
                window.error.open(data.error_message);
            }
        });
    },
    close: function() {
        var element = $(".popup-groups");
        element.fadeOut(300);

        setTimeout(function() {
            element.remove();
        }, 350);
    },
    toggle: function(group) {
        var user = group.parents(".popup-groups").attr("data-user");

        $.post("/groups/popup/" + user + "/", {
            group:  group.attr("data-group")
        }, function(data) {
            if(typeof data != "object") {
                var button = $(".add-groups[data-user='" + user + "']");
                var parent = button.parent();
                var new_button = $(data);

                if(group.hasClass("active")) {
                    group.removeClass("active");
                    group.find(".icon").attr({
                        class: "icon " + window.config.icons.unchecked
                    });
                } else {
                    group.addClass("active");
                    group.find(".icon").attr({
                        class: "icon " + window.config.icons.checked
                    });
                }

                button.remove();
                parent.append(new_button);
            } else if(!data.success) {
                window.error.open(data.error_message);
            }
        });
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
