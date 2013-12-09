Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function createRange() {
  var start, end, step;
  var array = [];

  switch(arguments.length){
    case 0:
      throw new Error('range() expected at least 1 argument, got 0 - must be specified as [start,] stop[, step]');
      return array;
    case 1:
      start = 0;
      end = Math.floor(arguments[0]) - 1;
      step = 1;
      break;
    case 2:
    case 3:
    default:
      start = Math.floor(arguments[0]);
      end = Math.floor(arguments[1]) - 1;
      var s = arguments[2];
      if (typeof s === 'undefined'){
        s = 1;
      }
      step = Math.floor(s) || (function(){ throw new Error('range() step argument must not be zero'); })();
      break;
   }

  if (step > 0){
    for (var i = start; i <= end; i += step){
      array.push(i);
    }
  } else if (step < 0) {
    step = -step;
    if (start > end){
      for (var i = start; i > end + 1; i -= step){
        array.push(i);
      }
    }
  }
  return array;
}

$(function() {
    //Check For Notifications
    window.socketUtil.notifications();
    setInterval(window.socketUtil.notifications, 10000);

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

window.socketUtil = {
    socket: io.connect(window.config.host + ":" + window.config.port, {
        "sync disconnect on unload": true
    }),
    pageTrack: function() {
        if(config.pageTrack) {
            window.socketUtil.socket.emit("pageTrack", window.location.href);
        }
    },
    notification: function(notification) {
        $(".sidebar .profile .img").toggleClass("blink", notification);
    },
    notifications: function() {
        var _this = this;
        window.socketUtil.socket.emit("notifications", function(notifications) {
            _this.notification(notification);
        });
    }
}

window.onpopstate = window.socketUtil.pageTrack;
window.socketUtil.socket.on("connect", window.socketUtil.pageTrack);
window.socketUtil.socket.on("reconnect", window.socketUtil.pageTrack);
window.socketUtil.socket.on("notification", window.socketUtil.notification);
