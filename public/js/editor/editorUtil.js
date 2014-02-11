/////////////////////////////////////////////////
//          Editor Instances
/////////////////////////////////////////////////
window.editorUtil = {
    clean: true,
    fullscreenActive: false,
    fullscreeenTransitioning: false,
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
                setTimeout(_this.resize, 300);
            }, 200);
        } else {
            var terminal =  "/terminal/" + $('.terminal iframe').data("location") + "/";
            $(".terminal, .terminal-toggle").addClass("active");
            $('.terminal iframe')
                .hide()
                .attr("src", terminal)
                .load(function() {
                    $(this).show();
                });
            $(".terminal a").attr("href", terminal);
            setTimeout(_this.resize, 300);
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
            $(".sidebar")
                .removeClass("fullscreen");

            setTimeout(function() {
                $(".content .fullscreen-toggle")
                    .removeClass(window.config.icons.contract + " active")
                    .addClass(window.config.icons.expand);
                $(".sidebar .profile , .header .top").slideDown(500);
                $(".chat").animate({
                    top: 95,
                    height: $(window).height() - $(".header .top").outerHeight()
                }, 500);
            }, 100);
        } else {
            $(".content .fullscreen-toggle")
                .removeClass(window.config.icons.expand)
                .addClass(window.config.icons.contract + " active");
            $(".sidebar .profile , .header .top").slideUp(500);
            $(".chat").animate({
                top: 0,
                height: $(window).height()
            }, 500);

            setTimeout(function() {
                $(".sidebar")
                    .addClass("fullscreen");
            }, 600);
        }

        setTimeout(function() {
            _this.fullscreeenTransitioning = false;
            _this.resize();
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
    },
    setInfo: function() {
        var file = window.editor.getValue();

        //File Size
        $(".filter[data-key='file-size'] strong").text(file_size.size(file));

        //File Line Count
        $(".filter[data-key='file-lines'] strong").text(file.split("\n").length);
    },
    resize: function() {
        if(!window.editorUtil.fullscreeenTransitioning) {
            window.editor.setSize("",
                $(window).height() - $(".header").height() - $(".terminal").height() - (parseInt($(".terminal").css("bottom"))|| 0)
            );
            editor.refresh();
        }
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
        window.socketUtil.socket.removeAllListeners();
        window.backdrop.error(message, url);
    }
}
