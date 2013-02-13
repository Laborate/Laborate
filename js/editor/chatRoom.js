//////////////////////////////////////////////////
//          Chat Room Instances
/////////////////////////////////////////////////
window.chatRoom = {
    clear: function() {
        $(".jspPane").html('<div id="chatBottom"></div>');
         window.chatRoom.resize();
    },
    help: function() {
        $(".jspPane").append('<strong><div class="chatRoomStatus" style="text-align:left; text-decoration:underline;">Console Commands</div></strong>');
    	$(".jspPane").append('<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">:c = clear screen</div>');
    	$(".jspPane").append('<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">:h = console commands</div>');
    	$(".jspPane").append('<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">:n = toggle chat notifications</div>');
    	$(".jspPane").append('<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">:s = toggle sidebar visibility</div>');
    	$(".jspPane").append('<div class="chatRoomStatus">*1 command per message*</div>');
    	$(".jspPane").append('<strong><div class="chatRoomStatus" style="text-align:left; text-decoration:underline;">Message References</div></strong>');
    	$(".jspPane").append('<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">&number = scroll to line</div>');
    	$(".jspPane").append('<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">#number = highlight line</div>');
    	$(".jspPane").append('<div class="chatRoomStatus" style="text-align:left; text-indent: 10px;">@pattern = search for word</div>');
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
        if(window.activated) {
            if(window.chatRoom._check(message, "commands", from) != true) {
                if(direction == "out") { window.chatRoom._pushMessage(message); }
                var lineContent = window.chatRoom._check(message, "line");
                var searchContent = window.chatRoom._check(lineContent, "search");
                var scrollContent = window.chatRoom._check(searchContent, "scroll");
                window.chatRoom._inputMessage(name, scrollContent, direction);
            }
            window.chatRoom.resize();
            window.chatRoom._scrollToBottom();
    	}
    },
    status: function(message) {
        if(window.activated) {
            window.chatRoom._inputStatus(message);
            window.chatRoom.resize();
            window.chatRoom._scrollToBottom();
    	}
    },
    resize: function() {
        var header = parseInt($("#header").height());
        var chatroom_messenger = parseInt($("#chatBox").height());
        var window_height = parseInt($(window).height());
        $("#chatConversation").height((window_height - (header + chatroom_messenger + 30)) + "px");
    },
    _scrollToBottom: function() {
        window.jscrollData.reinitialise();
        window.jscrollData.scrollToPercentY("100");
    },
    screenNameChange: function(oldScreenName, newScreenName) {
        $.cookie("screenName", newScreenName);
        if(window.activated) {
            if(oldScreenName != "undefined" && newScreenName != "undefined") {
                window.nodeSocket.emit( 'chatRoom' , {"from":window.userId, "name":newScreenName, "message":oldScreenName + " new screen name: " + newScreenName, "isStatus": true} );
                $(".out .chatRoomName").text($.cookie("screenName"));
            }
        }
    },
    _check: function(message, type, name) {
        if(type == "commands") {
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
        } else {
            types = { "search": [/.*@.*/ig, "@", "searchCode"],
                      "line": [/.*#\d.*/ig, "#", "highLightLine"],
                      "scroll": [/.*&.*/ig, "&", "scrollToLine"] }

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
        var key = Math.floor((Math.random()*10000)+1);
        var html = '<div class="chatRoomMessage ' + direction + ' ' + key + '">'
        html += '<div class="chatRoomName">' + name +'</div><div class="chatRoomBubble"></div></div>';
        $(".jspPane").append(html).find("." + key + " .chatRoomBubble").text(message);
        $(".jspPane *").removeClass(key + "");
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
    _signIn: function() {
        if(window.activated) {
            window.nodeSocket.emit( 'chatRoom' , {"from":window.userId, "name":$.cookie("screenName"), "message":$.cookie("screenName") + " has signed in", "isStatus": true} );
         }
    },
    _signOut: function() {
        if(window.activated) {
            window.nodeSocket.emit( 'chatRoom' , {"from":window.userId, "name":$.cookie("screenName"), "message":$.cookie("screenName") + " has signed out", "isStatus": true, "isLeave":true} );
        }
    },
    _pushMessage: function(message) {
        if(window.activated) {
            window.nodeSocket.emit( 'chatRoom' , {"from":window.userId, "name":$.cookie("screenName"), "message": message, "isStatus": false} );
        }
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
});

$(window).unload(function() { window.chatRoom._signOut(); });
$(window).resize(function() { window.chatRoom.resize(); });
setInterval(function(){ window.chatRoom.resize(); }, 1000);


//Submit New Message
$("#messenger").live('keydown', function(e) {
    //Checks if enter key is pressed
    if(e.which == 13) {
    	if($.trim($(this).val()) != "") {
    		if($.cookie("screenName") == "" || $.cookie("screenName") == null) {
    		   window.chatRoom.status("Please Enter Your Screen Name");
    		   window.chatRoom.status("in the sidebar to the left");
    		   sidebar('settings', 'screenName');
            }
    		else {
        		window.chatRoom.message(window.userId, $.cookie("screenName"), $.trim($(this).val()), "out");
    		}
    	}
    	window.chatRoom._reset();
	}
});

//Pull Message
window.nodeSocket.on('chatRoom', function (data) {
    if(window.activated) {
        if(data['from'] != window.userId && (""+data['from']) != "null") {
            if(data['isStatus']) {
                window.chatRoom.status(data['message']);
            }
            else {
                window.chatRoom.message(data['from'], data['name'], data['message'], "in");
            }
        }

        if(data["isLeave"]) {
            userBlock(data['from'], data['name'], true);
            usersCursors(data['from'], true)
        }
        else {
            userBlock(data['from'], data['name']);
        }
    }
});