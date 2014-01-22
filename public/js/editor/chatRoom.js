//////////////////////////////////////////////////
//          Chat Room Instances
/////////////////////////////////////////////////
window.chat = {
    focus: false,
    count: 0,
    conversation: function() {
        return $('.chat .scroll-pane').data("jsp")
    },
    clear: function() {
        $(".jspPane").html("");
         window.chat.resize();
    },
    help: function() {
    	window.chat.helper([
            ['Console Commands', 'bold underline'],
            ['1 command per message', 'indent small'],
            [':c = clear history', 'indent'],
            [':h = console commands', 'indent'],
            [':n = toggle notifications', 'indent'],
            ['', 'seperator'],
            ['Message References', 'bold underline'],
            ['&number = scroll', 'indent'],
            ['#number / range = highlight', 'indent'],
            ['^word = search', 'indent']
    	]);
    },
    toggle: function() {
        if(window.notifications == false) {
            window.notifications = true;
            window.chat.status("Chat Notifications Turned On");
        }
        else {
            window.chat.status("Chat Notifications Turned Off");
            window.notifications = false;
        }
        window.chat.resize();
        window.chat._scrollToBottom();

    },
    message: function(from, message, direction, gravatar, name) {
        if(!window.chat._check(message, "commands", from)) {
            if(window.chat._check(message, "js")) {
                if(direction == "out") {
                    window.chat._pushMessage(message);
                }

                var lineContent = window.chat._check(message, "line");
                var searchContent = window.chat._check(lineContent, "search");
                var scrollContent = window.chat._check(searchContent, "scroll");
                var linkContent = window.chat._check(scrollContent, "links");
                window.chat._inputMessage(from, linkContent, direction, gravatar, name);
            }
        }
        window.chat.resize();
        window.chat._scrollToBottom();
    },
    status: function(message) {
        window.chat._inputStatus(message);
        window.chat.resize();
        window.chat._scrollToBottom();
    },
    helper: function(messages) {
        window.chat._inputHelper(messages);
        window.chat.resize();
        window.chat._scrollToBottom();
    },
    resize: function() {
        if(!window.editorUtil.fullscreeenTransitioning) {
            if($(".header .top").is(":visible")) {
                $(".chat").height($(window).height() - $(".header .top").outerHeight());
            } else {
                $(".chat").height($(window).height());
            }
        }
    },
    signIn: function(screenName) {
        window.screenName = screenName;
        $.cookie("screenName", screenName);
        window.chat.status(screenName + " has signed in");
    },
    signOut: function(screenName) {
        window.chat.status(screenName + " has signed out");
    },
    _scrollToBottom: function() {
        window.window.chat.conversation().reinitialise();
        window.window.chat.conversation().scrollToPercentY("100");
    },
    _check: function(message, type) {
        if(type == "commands") {
            message = message.toLowerCase();
            commands = {
                ":c": "clear",
		        ":h": "help",
		        ":n": "toggle"
            }

        	for(var command in commands) {
        		if(message == command) {
                    window.chat[commands[command]](message);
                    return true
        		}
        	}
        } else if(type == "js") {
            if(message.toLowerCase().search(/.*<script.*/ig)) {
                return true;
            } else {
                return false;
            }
        } else if(type == "links") {
            var urlRegex = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
            return message.replace(urlRegex, '<a class="link" target="_blank" href="$1">$1</a>');
        } else {
            types = {
                "search": [/.*\^.*/ig, "^", "window.sidebarUtil.search"],
                "line": [/.*#\d.*/ig, "#", "window.sidebarUtil.highlight"],
                "scroll": [/.*&.*/ig, "&", "window.sidebarUtil.jumpToLine"]
            }

            if(!message.search(types[type][0])) {
        		var splits = (" " + message + " ").split(types[type][1]);

        		if(splits[0].length == 0){
        		    var before = ""
                } else {
                    var before = splits[0]
                };

        		var middle = splits[1].split(" ")[0];

        		if(splits[1].split(" ")[1].length == 0){
        		    var after = ""
                } else {
                    var list = splits[1].split(" ");
                    list.shift();
                    var after =  " " + list.join(" ")
                };

        		middleCall = "'" + middle + "'";
        		return (before + '<span class="link" onClick="' + types[type][2] +
        		            '(' + middleCall + ')"> '+ middle +'</span>' + after);
        	} else {
        		return message;
        	}
        }
    },
    _inputMessage: function(from, message, direction, gravatar, name) {
        if(direction == "in") window.chat._notify();
        var last_message = $(".jspPane .item").eq(-1);
        if(last_message.attr("data-from") == from) {
            last_message
                .find(".bubble")
                .append('<div class="separator"></div>' + message);
        } else {
            var html = ('                                           \
                <div data-from="' + from + '"                       \
                    class="item message ' + direction + '">         \
                    <div class="gravatar">                          \
                        <img src="' + gravatar + '" />              \
                    </div>                                          \
                    <div class="information">                       \
                        <div class="name">' + name + '</div>        \
                        <div class="bubble">' + message + '</div>   \
                    </div>                                          \
                </div>                                              \
            ');
            $(".jspPane").append(html);
        }
    },
    _inputStatus: function(status) {
        window.chat._notify();

        if(window.notifications != false) {
    	   $(".jspPane").append('<div class="item status">' + status + '</div>');
        }
    },
    _inputHelper: function(helpers) {
        var html = '<div class="item helper">';

        $.each(helpers, function(key, helper) {
            html += "<div class='" + (helper[1] || "") + "'>" + helper[0] + "</div>";

            if(key == helpers.length-1) {
                html += "</div>";
            }
        })

        $(".jspPane").append(html);
    },
    _pushMessage: function(message) {
        window.socketUtil.socket.emit('editorChatRoom', {
            "message": message,
            "isStatus": false
        });
    },
    _notify: function() {
        if(!window.chat.focus) {
            window.chat.count++;
            window.sidebarUtil.setTitle(
                "in",
                window.editorUtil.name,
                window.chat.count
            );
        }
    }
}

//////////////////////////////////////////////////
//          Chat Room Control Functions
/////////////////////////////////////////////////
$(function() {
    setTimeout(window.chat.help, 10);
    setInterval(window.chat.resize, 1000);
    $(window).resize(window.chat.resize);

    //Submit New Message
    $(".messenger textarea").on('keydown', function(e) {
        //Checks if enter key is pressed
        if(e.which == 13) {
            var _this = $(this);
        	if($.trim(_this.val()) != "") {
        		  window.chat.message("me", $.trim(_this.val()), "out", config.gravatar, "");
        		  _this.val("");
        	}

        	return false;
    	}
    });

    $(".messenger textarea").on('focus', function() {
        window.chat.count = 0;
        window.sidebarUtil.setTitle("in", window.editorUtil.name);
    });

    //Pull Message
    window.socketUtil.socket.on('editorChatRoom', function (data) {
        if(data.isStatus) {
            window.chat.status(data.message);
        }
        else {
            window.chat.message(data.from, data.message, "in", data.gravatar, data.name);
        }
    });
});



window.addEventListener('focus', function() {
    window.chat.focus = true;
});

window.addEventListener('blur', function() {
    window.chat.focus = false;
});
