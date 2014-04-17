/////////////////////////////////////////////////
//          Editor Instances
/////////////////////////////////////////////////
window.editorUtil = {
    clean: true,
    fullscreenActive: false,
    name: "",
    interval: null,
    notification: function(message, permanent) {
        $(".header .bottom .filters, .header .bottom .linkable")
            .toggle(!message);

        $(".header .bottom .message")
            .text(message)
            .toggle(!!message) ;

        if(!permanent && message) {
            setTimeout(function() {
                window.editorUtil.notification(false);
            }, 15000);
        }
    },
    terminal: function(show) {
        var _this = this;

        if($(".terminal").hasClass("active") || show == false) {
            $(".terminal iframe").fadeOut(150);

            setTimeout(function() {
                $(".terminal iframe").attr("src", "");
                $(".terminal, .terminal-toggle").removeClass("active");
            }, 200);
        } else {
            var terminal =  "/terminals/" + $('.terminal iframe').data("location") + "/";
            $(".terminal, .terminal-toggle").addClass("active");
            $('.terminal iframe')
                .hide()
                .attr("src", terminal + "embed/")
                .load(function() {
                    $(this).show();
                });
            $(".terminal a").attr("href", terminal);
        }

        setTimeout(function() {
            window.editor.refresh();
        }, 500);
    },
    fullscreen: function(fullscreen, cookie) {
        var _this = this;
        _this.fullscreenActive = fullscreen;

        if(cookie != false) {
            $.cookie("fullscreen", fullscreen, {
                path: '/editor',
                expires: 365
            });
        }

        if(!fullscreen) {
            $(".main .fullscreen-toggle")
                .removeClass(window.config.icons.contract + " active")
                .addClass(window.config.icons.expand);

            $(".panel").removeClass("fullscreen");
        } else {
            $(".main .fullscreen-toggle")
                .removeClass(window.config.icons.expand)
                .addClass(window.config.icons.contract + " active");

            $(".panel").addClass("fullscreen");
        }
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

                window.editor.operation(function() {
                    var current = data.next;

                    window.editor.replaceRange(
                        data.text,
                        data.from,
                        data.to
                    );

                    async.whilst(function() {
                        return !!current;
                    }, function (callback) {
                        window.editor.replaceRange(
                            current.text,
                            current.from,
                            current.to
                        );

                        current = current.next;
                        callback();
                    }, Function);
                });
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
                        "breakpoints": [{
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
            var user = window.users[value];

            if(user.selection) {
                user.selection.clear();
            }

            user.cursor.remove();
            delete window.users[value];
        })).done($(data).not(Object.keys(window.users)).each(function(index, value) {
            $("                                                             \
                <style type='text/css' data-user=" + value + ">             \
                    .u" + value + " {                                       \
                        background:" + randomColor() + " !important;        \
                    }                                                       \
                </style>                                                    \
            ").appendTo("head");
            window.users[value] = {
                cursor: $("<div class='cursor u" + value + "'>"),
                selection: null
            }
        }));
    },
    userCursors: function(direction, data) {
        if(window.editorUtil.initialized) {
            if(direction == "out") {
                window.socketUtil.socket.emit('editorCursors', data);
            } else if(direction == "in") {
                var user = window.users[data.from];

                if(user) {
                    if(user.selection) {
                        user.selection.clear();
                    }

                    if(data.leave) {
                        user.hide();
                    } else if(data.cord) {
                        window.editor.addWidget(data.cord, user.cursor.get(0), false);
                    } else if(data.selection) {
                        user.selection = window.editor.markText(data.selection.from, data.selection.to, {
                            "className": "u" + data.from
                        });
                    }
                }
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
    setMode: function(name, object) {
        window.sidebarUtil.defaultLanguage(name);
        CodeMirror.autoLoadMode(window.editor, $.trim(object.mode));

        setTimeout(function() {
            window.editor.setOption("mode", $.trim(object.mime));

            setTimeout(function() {
                if(editor.getMode().name == "null") {
                    window.editor.setOption("mode", $.trim(object.mode));
                }
            }, 500);
        }, 500);
    },
    setModeExtension: function(extension) {
        if(extension) {
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
        }
    },
    setModeLanguage: function(language) {
        if(language) {
            var modeName = language;
            var modeObject = window.editorUtil.languages[language];

            if(!language || !modeObject) {
                Raven.captureMessage("Unknown Code Editor Language: " + language);

                var modeName = "Plain Text";
                var modeObject = window.editorUtil.languages[modeName];
            }

            this.setMode(modeName, modeObject);
        }
    },
    join: function(callback) {
        //Have to wait for the socket to initialize
        interval = setInterval(function() {
            if(window.socketUtil.socket.socket.connected) {
                clearInterval(interval);
                window.socketUtil.socket.emit("editorJoin", function(json) {
                    if(json.success) {
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
                                if(json.permission.readonly && json.permission.id == 2) {
                                    json.permission.name = config.permissions[2];
                                }

                                window.sidebarUtil.laborators();
                                window.sidebarUtil.setAccess(json.permission.name);
                                window.sidebarUtil.setTitle("in", json.name);
                                window.editorUtil.setInfo();
                                window.editor.clearHistory();

                                clearInterval(window.editorUtil.interval);

                                window.editorUtil.interval = setInterval(function() {
                                    window.editor.options.readOnly = json.permission.readonly;
                                }, 50);
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
                        window.editorUtil.error(json.error_message, json.redirect_url);
                    }
                });
            }
        }, 100);
    },
    error: function(message, url) {
        if(config.embed) {
            url = true;
        }

        window.socketUtil.socket.removeAllListeners();
        window.backdrop.error(message, url);
    }
}
