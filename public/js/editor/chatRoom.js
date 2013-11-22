//////////////////////////////////////////////////
//          Chat Room Instances
/////////////////////////////////////////////////
window.chatRoom = {
    clear: function() {
        $(".jspPane").html('<div id="chatBottom"></div>');
         window.chatRoom.resize();
    },
    help: function() {
        help = '<strong><div class="chatRoomHelper" style="text-align:left; text-decoration:underline; margin: 5px 0px 0px 0px;">Console Commands</div></strong>';
        help += '<div style="text-align:left; font-size:12px; color:#666; margin: 5px 0px;" class="chatRoomHelper">1 command per message</div>';
        help += '<div class="chatRoomHelper" style="text-align:left; text-indent: 10px;">:c = clear screen</div>';
        help += '<div class="chatRoomHelper" style="text-align:left; text-indent: 10px;">:h = console commands</div>';
        help += '<div class="chatRoomHelper" style="text-align:left; text-indent: 10px;">:n = toggle chat notifications</div>';
        help += '<div class="chatRoomHelper" style="text-align:left; text-indent: 10px; margin-bottom: 30px;">:s = toggle sidebar visibility</div>';
        help += '<strong><div class="chatRoomHelper" style="text-align:left; text-decoration:underline;">Message References</div></strong>';
        help += '<div class="chatRoomHelper" style="text-align:left; text-indent: 10px;">&number = scroll to line</div>';
        help += '<div class="chatRoomHelper" style="text-align:left; text-indent: 10px;">#number = highlight line</div>';
        help += '<div class="chatRoomHelper" style="text-align:left; text-indent: 10px;">^pattern = search for word</div>';
    	$(".jspPane").append(help);
    	window.chatRoom.resize();
    	window.chatRoom._scrollToBottom();
    },
    toggle: function() {
        if(window.notifications == false) {
            window.notifications = true;
            window.chatRoom.status("Chat Notifications Turned On");
        }
        else {
            window.chatRoom.status("Chat Notifications Turned Off");
            window.notifications = false;
        }
        window.chatRoom.resize();
        window.chatRoom._scrollToBottom();

    },
    sidebar: function() {
        if($("#sidebar").is(":visible")) {
            $("#editorCodeMirror").css("margin-left", "5px");
        } else {
            $("#editorCodeMirror").css("margin-left", "");
        }
        $("#sidebar").toggle();
        window.editor.refresh();
    },
    message: function(from, message, direction) {
        if(!window.chatRoom._check(message, "commands", from)) {
            if(window.chatRoom._check(message, "js")) {
                if(direction == "out") {
                    window.chatRoom._pushMessage(message);
                }

                var lineContent = window.chatRoom._check(message, "line");
                var searchContent = window.chatRoom._check(lineContent, "search");
                var scrollContent = window.chatRoom._check(searchContent, "scroll");
                var linkContent = window.chatRoom._check(scrollContent, "links");
                window.chatRoom._inputMessage(from, linkContent, direction);
            }
        }
        window.chatRoom.resize();
        window.chatRoom._scrollToBottom();
    },
    status: function(message) {
        window.chatRoom._inputStatus(message);
        window.chatRoom.resize();
        window.chatRoom._scrollToBottom();
    },
    resize: function() {
        $(".chat").height($(window).height() - $(".header").height());
    },
    signIn: function(screenName) {
        window.screenName = screenName;
        $.cookie("screenName", screenName);
        window.chatRoom.status(screenName + " has signed in");
    },
    signOut: function(screenName) {
        window.chatRoom.status(screenName + " has signed out");
    },
    _scrollToBottom: function() {
        //window.jscrollData.reinitialise();
        //window.jscrollData.scrollToPercentY("100");
    },
    _check: function(message, type) {
        if(type == "commands") {
            message = message.toLowerCase();
            commands = {
                ":c": "clear",
		        ":h": "help",
		        ":n": "toggle",
		        ":s": "sidebar"
            }

        	for(var command in commands) {
        		if(message == command) {
                    window.chatRoom[commands[command]](message);
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
    _inputMessage: function(from, message, direction) {
        var html = '<div class="chatRoomMessage ' + direction + '"><div class="chatRoomName">';
        html += from +'</div><div class="chatRoomBubble">' + message +'</div></div>';
        $(".jspPane").append(html);
    },
    _inputStatus: function(status) {
        if(window.notifications != false) {
    	   $(".jspPane").append('<div class="chatRoomStatus">' + status + '</div>');
        }
    },
    _reset: function() {
        $("#messenger").blur();
        setTimeout(function() {
            $("#messenger").val('').focus()
        }, 05);
    },
    _pushMessage: function(message) {
        window.socketUtil.socket.emit('editorChatRoom', {
            "message": message,
            "isStatus": false
        });
    }
}

//////////////////////////////////////////////////
//          Chat Room Control Functions
/////////////////////////////////////////////////
$(function() {
     $('.chat .conversation').data("jsp");

    //setTimeout(window.chatRoom.help, 10);
    setInterval(window.chatRoom.resize, 1000);
    $(window).resize(window.chatRoom.resize);

    //Submit New Message
    $("#messenger").on('keydown', function(e) {
        //Checks if enter key is pressed
        if(e.which == 13) {
        	if($.trim($(this).val()) != "") {
        		  window.chatRoom.message("me", $.trim($(this).val()), "out");
        	}
        	window.chatRoom._reset();
    	}
    });

    //Pull Message
    window.socketUtil.socket.on('editorChatRoom', function (data) {
        if(data['isStatus']) {
            window.chatRoom.status(data['message']);
        }
        else {
            window.chatRoom.message(data['from'], data['message'], "in");
        }

        if($("#header").is(":visible") == false) {
            var count = $("#chat_bubble_count").text();
            count = (count) ? parseInt(count) : 0;
            $("#chat_bubble_count").text(count + 1);
        }
    });
});
