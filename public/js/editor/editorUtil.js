/////////////////////////////////////////////////
//          Editor Instances
/////////////////////////////////////////////////
window.editorUtil = {
    clean: true,
    setChanges: function(direction, data, override) {
        if(data['origin'] != "setValue") {
            if(direction == "out" && window.editorUtil.initialized) {
                if(window.editorUtil.clean) {
                    window.socketUtil.socket.emit('editorDocument', {
                        "changes": data
                    });
                } else {
                    window.editorUtil.clean = true;
                }
            } else if(direction == "in") {
                if(window.editorUtil.clean || override) {
                    window.editorUtil.clean = false;
                    window.editor.replaceRange(data['text'], data['from'], data['to']);
                } else {
                    window.editorUtil.clean = true;
                }
            }
        }
    },
    gutterClick: function(direction, data) {
        $.each(data, function(index, value) {
            if(!isNaN(value["line"])) {
                var info = window.editor.lineInfo(parseInt(value["line"]));
                var marker = document.createElement("div");
                marker.className ="CodeMirror-breakpoint";
                marker.innerHTML = "●";

                if(direction == "out" && window.editorUtil.initialized) {
                    window.editor.setGutterMarker(value["line"], "breakpoints", info.gutterMarkers ? null : marker);
                    window.socketUtil.socket.emit('editorExtras', {
                        "breakpoint": [{
                            "line": value["line"],
                            "remove": info.gutterMarkers
                        }]
                    });
                } else if(direction == "in") {
                    window.editor.setGutterMarker(value["line"], "breakpoints", value["remove"] ? null : marker);
                }
            }
        });
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
        if(direction == "out" && window.editorUtil.initialized) {
            if(data['leave']) {
                window.socketUtil.socket.emit('editorCursors', {"leave":true});
            } else {
                window.socketUtil.socket.emit('editorCursors', {"line":data['line']});
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
            $("#full_screen, #chat_bubble").css({"font-size": "24px"}).show();
            $("#sidebar, #header, #chatRoom").hide();
            $("#chat_bubble_count").text("");
        } else {
            $("#editorCodeMirror").css({"margin": "", "width": ""});
            $("#full_screen").addClass("icon-expand-2");
            $("#full_screen").removeClass("icon-contract-2");
            $("#full_screen").css({"font-size": "", "margin": ""});
            $("#sidebar, #header, #chatRoom").show();
            $("#chat_bubble").hide();
            setTimeout(window.chatRoom._scrollToBottom, 600);
        }

        window.editor.refresh();
        window.editorUtil.refresh();
    },
    join: function(password, reconnect, callback) {
        //Have to wait for the socket to initialize
        interval = setInterval(function() {
            if(window.socketUtil.socket.socket.connected) {
                clearInterval(interval);
                window.socketUtil.socket.emit("editorJoin", [password, reconnect], function(json) {
                    if(json.success) {
                        if(password) {
                            window.editorUtil.access_token = password;
                        } else {
                            window.editorUtil.access_token = null;
                        }

                        async.series([
                            function(next) {
                                $("#editorCodeMirror").css({"opacity": "0"});
                                next();
                            },
                            function(next) {
                                window.editor.setValue(json.content);
                                next();
                            },
                            function(next) {
                                window.editorUtil.gutterClick("in", json.breakpoints);
                                next();
                            },
                            function(next) {
                                if(json.changes.length != 0) {
                                    $.each(json.changes, function(index, value) {
                                        window.editorUtil.setChanges("in", value, true);
                                        if (index == json.changes.length-1) {
                                            next();
                                        }
                                    });
                                } else {
                                    next();
                                }
                            },
                            function(next) {
                                window.editor.clearHistory();

                                if(callback) {
                                    callback();
                                } else {
                                    $("#backdrop").hide();
                                    $("#editorCodeMirror").css({"opacity": ""});
                                }

                                window.editorUtil.initialized = true;
                                next();
                            }
                        ]);
                    } else {
                        if(json.error_message) {
                            window.editorUtil.error(json.error_message, json.redirect_url);
                        } else {
                            window.location.href = json.redirect_url;
                        }
                    }
                });
            }
        }, 100);
    },
    error: function(message, url) {
        if(message == "You Are Already Editing This Document") {
            message += "<br><button id='disconnectAll' style='margin-top: 5px' \
                       class='backdrop-button'>Disconnect All Other Sessions</button>";

            $(document).on("click", "#disconnectAll", function() {
                $(this).val("loading...").addClass("disabled");
                 window.socketUtil.socket.emit("editorDisconnectAll", {}, function(json) {
                    if(json.success) {
                        window.location.reload(true);
                    }
                 });
            });
        }

        window.backdrop.error(message, url);
    }
}
