/////////////////////////////////////////////////
//          Editor Instances
/////////////////////////////////////////////////
window.editorUtil = {
    clean: true,
    fullscreenActive: false,
    fullscreeenTransitioning: false,
    notification: function(message, permanent) {
        $(".header .bottom .filters")
            .toggle(!message)
            .next(".message")
            .text(message)
            .toggle(!!message) ;

        if(!permanent && message) {
            setTimeout(function() {
                window.editorUtil.notification(false);
            }, 15000);
        }
    },
    fullscreen: function(show) {
        var _this = this;
        _this.fullscreenActive = !show;
        _this.fullscreeenTransitioning = true;
        $.cookie("fullscreen", !show, {
            path: '/editor',
            expires: 365
        });

        if(show) {
            $(".fullscreen")
                .removeClass(window.config.icons.contract + " active")
                .addClass(window.config.icons.expand);
            $(".sidebar .profile , .header .top").slideDown(500);
            $(".chat").animate({
                top: 95,
                height: $(window).height() - $(".header .top").outerHeight()
            }, 500);
        } else {
            $(".fullscreen")
                .removeClass(window.config.icons.expand)
                .addClass(window.config.icons.contract + " active");
            $(".sidebar .profile , .header .top").slideUp(500);
            $(".chat").animate({
                top: 0,
                height: $(window).height()
            }, 500);
        }

        setTimeout(function() {
            _this.fullscreeenTransitioning = false;
            _this.refresh();
            window.chat.resize();
        }, 600);
    },
    setChanges: function(direction, data, override) {
        window.editorUtil.setInfo();

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
    setInfo: function() {
        var file = window.editor.getValue();

        //File Size
        $(".filter[data-key='file-size'] strong").text(file_size.size(file));

        //File Line Count
        $(".filter[data-key='file-lines'] strong").text(file.split("\n").length);
    },
    refresh: function() {
        window.editor.setSize("", $(window).height() - $(".header").height());
        editor.refresh();
    },
    setMode: function(name, object) {
        window.sidebarUtil.defaultLanguage(name);
        CodeMirror.autoLoadMode(window.editor, $.trim(object.mode));

        setTimeout(function() {
            window.editor.setOption("mode", $.trim(object.mime));

            setTimeout(function() {
                if(editor.getMode().name == "null") {
                    window.editor.setOption("mode", $.trim(object.mode));
                    setTimeout(function () {
                        window.editor.refresh();
                    }, 100);
                }
            }, 100);
        }, 100);
    },
    setModeExtension: function(extension) {
        if(extension in window.editorUtil.extensions) {
            var modeName = window.editorUtil.extensions[extension];
            var modeObject = window.editorUtil.languages[modeName];
        }

        if(!extension || !modeObject) {
            if(!extension) {
                Raven.captureMessage("Unknown Code Editor Extension: " + extension);
            } else if(!modeObject && modeName) {
                Raven.captureMessage("Unknown Code Editor Mode: " + modeName);
            }

            var modeName = "Plain Text";
            var modeObject = window.editorUtil.languages[modeName];
        }

        this.setMode(modeName, modeObject);
        return modeName;
    },
    setModeLanguage: function(language) {
        var modeName = language;
        var modeObject = window.editorUtil.languages[language];

        if(!language || !modeObject) {
            Raven.captureMessage("Unknown Code Editor Language: " + language);

            var modeName = "Plain Text";
            var modeObject = window.editorUtil.languages[modeName];
        }

        this.setMode(modeName, modeObject);
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
                                    window.editor.operation(function() {
                                        $.each(json.changes, function(index, value) {
                                            window.editorUtil.setChanges("in", value, true);
                                            if (index == json.changes.length-1) {
                                                next();
                                            }
                                        });
                                    });
                                } else {
                                    next();
                                }
                            },
                            function(next) {
                                window.sidebarUtil.setTitle("in", json.name);
                                window.editorUtil.setInfo();
                                window.editor.clearHistory();
                                setTimeout(next, 1000);
                            },
                            function(next) {
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
        } else {
            window.socketUtil.socket.removeAllListeners();
        }

        window.backdrop.error(message, url);
    }
}
