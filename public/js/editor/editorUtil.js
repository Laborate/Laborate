/////////////////////////////////////////////////
//          Editor Instances
/////////////////////////////////////////////////
window.editorUtil = {
    clean: true,
    setChanges: function(direction, data) {
        if(data['origin'] != "setValue") {
            if(direction == "out") {
                if(window.editorUtil.clean) {
                    window.nodeSocket.emit('editorDocument', {
                        "changes": data
                    });
                } else {
                    window.editorUtil.clean = true;
                }
            } else if(direction == "in") {
                if(window.editorUtil.clean) {
                    window.editorUtil.clean = false;
                    window.editor.replaceRange(data['text'], data['from'], data['to']);
                } else {
                    window.editorUtil.clean = true;
                }
            }
        }
    },
    gutterClick: function(direction, data) {
        var info = window.editor.lineInfo(parseInt(data["line"]));
        var marker = document.createElement("div");
        marker.className ="CodeMirror-breakpoint";
        marker.innerHTML = "●";
        if(direction == "out") {
            window.editor.setGutterMarker(data["line"], "breakpoints", info.gutterMarkers ? null : marker);
            window.nodeSocket.emit('editorExtras', {
                "breakpoint": {
                    "line":data["line"],
                    "remove":info.gutterMarkers
                }
            });
        } else if(direction == "in") {
            window.editor.setGutterMarker(data["line"], "breakpoints", data["remove"] ? null : marker);
        }
    },
    users: function(data) {
        $.when($(Object.keys(window.users)).not(data).each(function(index, value) {
            window.editor.removeLineClass(window.users[value], "", ("u" + value));
            $("#document_contributors").find("[data=" + value + "]").remove();
            delete window.users[value];
        })).done($(data).not(Object.keys(window.users)).each(function(index, value) {
            $("<style type='text/css'> .u" + value + "{background:" + randomUserColor() + " !important;} </style>").appendTo("head");
            var contributor = '<div class="contributor u' + value + '" ';
            contributor += 'data="'+ value +'" userName="' + value + '"></div>';
            $("#document_contributors").append(contributor);
            window.users[value] = -1;
        }));
    },
    userHover: function(element) {
        $("#contributor_info #contributor_info_name").text(element.attr("username"));
        var contributor_box_offset = element.offset().left - (element.width()/2);
        var contributor_info = $("#contributor_info").width()/2;
        $("#contributor_info").show().css("left", (contributor_box_offset - contributor_info) + "px");
    },
    userLeave: function() {
        $("#contributor_info").hide().css("left", "0px");
        $("#contributor_info #contributor_info_name").text("");
    },
    userCursors: function(direction, data) {
        if(direction == "out") {
            if(data['leave']) {
                window.nodeSocket.emit('editorCursors', {"leave":true});
            } else {
                window.nodeSocket.emit('editorCursors', {"line":data['line']});
            }
        } else if(direction == "in") {
            if(data['leave']) {
                window.editor.removeLineClass(window.users[data['from']], "", ("u"+data['from']));
                window.users[data['from']] = -1;
            }
            else {
                window.editor.removeLineClass(window.users[data['from']], "", ("u"+data['from']));
                window.editor.addLineClass(data['line'], "", ("u"+data['from']));
                window.users[data['from']] = data['line'];
            }
        }
    },
    refresh: function() {
        var header = $("#header").height();
        var window_height = window.innerHeight;
        if($("#header").is(":visible")) {
            window.editor.setSize("", (window_height - header - 38) + "px")
        } else {
            window.editor.setSize("", (window_height - header - 68) + "px")
        }
        editor.refresh();
    },
    fullScreen: function() {
        if($("#header").is(":visible")) {
            $("#editorCodeMirror").css({"margin":" 30px auto 0 auto", "width": "90%"});
            $("#full_screen").addClass("icon-contract-2");
            $("#full_screen").removeClass("icon-expand-2");
            $("#full_screen").css({"font-size": "24px", "margin": "0 0 0 30px"});
            $("#sidebar, #header, #chatRoom").hide();
        } else {
            $("#editorCodeMirror").css({"margin": "", "width": ""});
            $("#full_screen").addClass("icon-expand-2");
            $("#full_screen").removeClass("icon-contract-2");
            $("#full_screen").css({"font-size": "", "margin": ""});
            $("#sidebar, #header, #chatRoom").show();
        }

        window.editor.refresh();
        window.editorUtil.refresh();
    },
    join: function(password) {
        //Have to wait for the socket to initialize
        interval = setInterval(function() {
            if(nodeSocket.socket.connected) {
                clearInterval(interval);
                window.nodeSocket.emit("editorJoin", [password, false], function(json) {
                    if(json.success) {
                        window.editor.setValue(json.content);
                        window.editor.clearHistory();
                        $("#backdrop").hide();
                        if(password) {
                            window.editorUtil.document_hash = password;
                        } else {
                            window.editorUtil.document_hash = null;
                        }
                    } else {
                        if(json.error_message) {
                            window.backdrop.error(json.error_message, json.redirect_url);
                        } else {
                            window.location.href = json.redirect_url;
                        }
                    }
                });
            }
        }, 100);
    }
}
