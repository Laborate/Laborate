//////////////////////////////////////////////////
//          Chat Room Instances
/////////////////////////////////////////////////
window.chatRoom = {
    clear: function() {
        $(".jspPane").html('<div id="chatBottom"></div>');
         window.chatRoom.resize();
    },
    help: function() {
        help = '<strong><div class="chatRoomStatus" style="text-align:left; text-decoration:underline; margin: 5px 0px 0px 0px;">Console Commands</div></strong>';
        help += '<div style="text-align:left; font-size:12px; color:#666; margin: 5px 0px;" class="chatRoomStatus">1 command per message</div>';
        help += '<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">:c = clear screen</div>';
        help += '<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">:h = console commands</div>';
        help += '<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">:n = toggle chat notifications</div>';
        help += '<div class="chatRoomStatus" style="text-align:left; text-indent: 10px; margin-bottom: 30px;">:s = toggle sidebar visibility</div>';
        help += '<strong><div class="chatRoomStatus" style="text-align:left; text-decoration:underline;">Message References</div></strong>';
        help += '<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">&number = scroll to line</div>';
        help += '<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">#number = highlight line</div>';
        help += '<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">@pattern = search for word</div>';
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
    message: function(from, name, message, direction) {
        if(window.chatRoom._check(message, "commands", from) != true) {
            if(window.chatRoom._check(message, "js")) {
                if(direction == "out") { window.chatRoom._pushMessage(message); }
                var lineContent = window.chatRoom._check(message, "line");
                var searchContent = window.chatRoom._check(lineContent, "search");
                var scrollContent = window.chatRoom._check(searchContent, "scroll");
                window.chatRoom._inputMessage(name, scrollContent, direction);
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
        var header = $("#header").height();
        var chatroom_messenger = $("#chatBox").height();
        var window_height = window.innerHeight;
        $("#chatConversation").height((window_height - (header + chatroom_messenger + 30)) + "px");
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
        window.jscrollData.reinitialise();
        window.jscrollData.scrollToPercentY("100");
    },
    screenNameChange: function(oldScreenName, newScreenName) {
        window.screenName = newScreenName;
        $.cookie("screenName", newScreenName);
        if(oldScreenName != "" && oldScreenName != "undefined" && newScreenName != "undefined") {
            window.nodeSocket.emit('chatRoom', {"from": window.userId, "name": newScreenName,
                                                "message": oldScreenName + " new screen name: " + newScreenName,
                                                "isStatus": true}
            );
            $(".out .chatRoomName").text(window.screenName);
        }
        $("#screenName").val(newScreenName);
    },
    _check: function(message, type, name) {
        if(type == "commands") {
            message = message.toLowerCase();
            commands = {":c": "clear",
				        ":h": "help",
				        ":n": "toggle",
				        ":s": "sidebar"
				}

        	for(var command in commands) {
        		if(message == command) {
            		if(name == window.userId) {
            			window.chatRoom[commands[command]](message);
                    }
                    return true
        		}
        	}
        } else if(type == "js") {
            if(message.toLowerCase().search(/.*<script.*/ig)) { return true; }
            else { return false; }
        } else {
            types = { "search": [/.*@.*/ig, "@", "window.sidebarUtil.search"],
                      "line": [/.*#\d.*/ig, "#", "window.sidebarUtil.highlight"],
                      "scroll": [/.*&.*/ig, "&", "window.sidebarUtil.scroll"] }

            if(!message.search(types[type][0])) {
        		var splits = (" " + message + " ").split(types[type][1]);

        		if(splits[0].length == 0){ var before = "" } else { var before = splits[0] };
        		var middle = splits[1].split(" ")[0]
        		if(splits[1].split(" ")[1].length == 0){ var after = "" }
        		else { var list = splits[1].split(" "); list.shift(); var after =  " " + list.join(" ") };

        		middleCall = "'" + middle + "'";
        		return before + '<span class="link" onClick="' + types[type][2] + '(' + middleCall + ')"> '+ middle +'</span>' + after;

        	} else {
        		return message;
        	}
        }
    },
    _inputMessage: function(name, message, direction) {
        var html = '<div class="chatRoomMessage ' + direction + '"><div class="chatRoomName">' + name +'</div><div class="chatRoomBubble">' + message +'</div></div>';
        $(".jspPane").append(html);
    },
    _inputStatus: function(status) {
        if(window.notifications != false) {
    	   $(".jspPane").append('<div class="chatRoomStatus">' + status + '</div>');
        }
    },
    _reset: function() {
        $("#messenger").blur();
        setTimeout(function() { $("#messenger").val('').focus() }, 05);
    },
    _pushMessage: function(message) {
        window.nodeSocket.emit( 'chatRoom' , {"from":window.userId,
                                              "name":window.screenName,
                                              "message": message,
                                              "isStatus": false} );
    }
}

//////////////////////////////////////////////////
//          Chat Room Control Functions
/////////////////////////////////////////////////
$(window).ready(function() {
    $(function() {
    	var pane = $('.scroll-pane');
    	pane.jScrollPane({ showArrows: false, animateScroll: true, autoReinitialise: true, hideFocus: true });
    	window.jscrollData = $('.scroll-pane').data('jsp');
	});

    setTimeout(function() { window.chatRoom.help(); }, 10);
    $(window).resize(function() { window.chatRoom.resize(); });
    setInterval(function(){ window.chatRoom.resize(); }, 1000);

    //Submit New Message
    $("#messenger").live('keydown', function(e) {
        //Checks if enter key is pressed
        if(e.which == 13) {
        	if($.trim($(this).val()) != "") {
        		if(window.screenName == "" || window.screenName == null) {
        		   window.chatRoom.status("Please Enter Your Screen Name");
        		   window.chatRoom.status("in the sidebar to the left");
        		   sidebar('settings', 'screenName');
                }
        		else {
            		window.chatRoom.message(window.userId, window.screenName, $.trim($(this).val()), "out");
        		}
        	}
        	window.chatRoom._reset();
    	}
    });

    //Pull Message
    window.nodeSocket.on('chatRoom', function (data) {
        if(data['from'] != window.userId && (""+data['from']) != "null") {
            window.editorUtil.users(data);
            if(data['isStatus']) {
                window.chatRoom.status(data['message']);
            }
            else {
                window.chatRoom.message(data['from'], data['name'], data['message'], "in");
            }
        }
    });
});
