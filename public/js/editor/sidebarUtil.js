window.sidebarUtil = {
	change: function(module, permanent) {
	    var element = $(".sidebar .list .item[data-key='" + module + "']");
	    if(module != false && (permanent || !element.hasClass("activated"))) {
	        $(".sidebar").addClass("menu");
	        $(".sidebar .pane > .item").hide();
	        $(".sidebar .list .item").removeClass("activated");
	        element.addClass("activated");
            $(".sidebar .pane > .item[data-key='" + module + "']").show();
            $(".sidebar .controller .title").text(element.find(".name").text());
        } else {
            $(".sidebar").removeClass("menu");
            $(".sidebar .controller .title").text("Menu Panel");
            $(".sidebar .list .item").removeClass("activated");
        }
	},
	submit: function(form) {
        switch(form.attr("name")) {
            case "undo":
                window.editor.undo();
                break;
            case "redo":
                window.editor.redo();
                break;
            case "type-mode":
                this.typeMode(
                    form.find("select[name='languages']").val(),
                    form.find("select[name='keymapping']").val()
                );
                break;
            case "beautify":
                this.beautify(form.find("select").val());
                break;
            case "line-jump":
                this.jumpToLine(form.find("input").val());
                form.find("input").val("");
                break;
            case "highlight-line":
                this.highlight(form.find("input").val());
                form.find("input").val("");
                break;
            case "highlight-word":
                this.search(form.find("input").val());
                form.find("input").val("");
                break;
            case "invite":
                this.invite(form.find("input").val());
                form.find("input").val("");
                break;
            case "commit":
                this.commit(form);
                break;
            case "save":
                this.save(form);
                break;
            case "print":
                this.print(form);
                break;
            case "download":
                this.download(form);
                break;
            case "settings":
                this.settings(form);
                break;
        }
	},
	populateLanguages: function() {
        var languages = "";
        $.each(window.editorUtil.languages, function(language, mode) {
            languages += "<option value='" + language + "'>" + language + "</option>";
        });

        $(".form[name='type-mode'] select[name='languages']").html(languages);
	},
	defaultLanguage: function(language) {
        $(".form[name='type-mode'] select[name='languages'] option")
            .filter(function() {
                return ($(this).text() == language);
            })
            .prop('selected', true);
	},
	defaultKeymap: function(keymap) {
	    if(keymap) {
    	    $(".form[name='type-mode'] select[name='keymapping'] option")
                .filter(function() {
                    return ($(this).val() == keymap);
                })
                .prop('selected', true);
        }
	},
	typeMode: function(languages, keymapping) {
	    window.editorUtil.setModeLanguage(languages);
        this.keyMap(keymapping);
	},
	keyMap: function(keymap) {
	    if(keymap) {
    		window.editor.setOption("keyMap", keymap);
    		$.cookie("keyMap", keymap, {
                path: '/editor',
                expires: 365
            });
        }
	},
	setAccess: function(access) {
        $(".filter[data-key='file-access'] strong").text(access);
	},
	setTitle: function(direction, title, notification) {
	    var name = (notification) ? title.slice(0,17) : title;
	    var notify = (notification) ? ("(" + notification + ")") : "";
	    var extension = title.split(".")[title.split(".").length - 1];
	    if(!notification) window.editorUtil.setModeExtension(extension);
	    window.editorUtil.name = title;

		$("#documentTitle").val(title);
		$("#document_title").text(title);
		$("title").text(name + notify + window.config.delimeter + window.config.name);
		if(direction == "out") {
    		window.socketUtil.socket.emit('editorExtras' , {
    		    "docName": $("#documentTitle").val()
            });
        }
	},
	togglePassword: function(active) {
        $(".form[name='settings'] input[name='password']")
            .val("")
            .prop("disabled", active);
	},
	beautify: function(select) {
	    window.editor.operation(function() {
	        if(select == "selection") {
                var start = window.editor.getCursor("start").line;
                var end = window.editor.getCursor("end").line;
	        } else {
    	        var start = window.editor.firstLine();
                var end = window.editor.lastLine();
	        }

            window.editor.eachLine(start, end, function(line) {
                window.editor.indentLine(
                    window.editor.getLineNumber(line),
                    "smart"
                );
            });
	    });
	},
	jumpToLine: function(line) {
	    try {
    	    line -= 1;
            window.editor.scrollIntoView({
                line: line,
                ch: 0
            });

            window.editor.addLineClass(line, "text", "CodeMirror-linejump");
            setTimeout(function() {
                window.editor.removeLineClass(line, "text", "CodeMirror-linejump");
            }, 5000);
        } catch(error) {
            return error;
        }
	},
	highlight: function(lines) {
	    if(lines && window.editor.getValue().length != 0) {
    	    try {
        	    var _this = this;
        	    _this.change("search", true);
        	    window.editor.operation(function() {
                    $.each(_this.highlightRange(lines), function(key, value) {
                        if(typeof value == "number") {
                            _this.highlightListing(value);
                            window.editor.addLineClass(value, "text", "CodeMirror-highlighted");
                        } else if(typeof value == "object") {
                            _this.highlightListing(value);
                            for (var line = value.from; line < value.to; line++) {
                                window.editor.addLineClass(line, "text", "CodeMirror-highlighted");
                            }
                        }
                    });
                });
            } catch(error) {
                return error;
            }
        }
	},
	highlightRemove: function(lines) {
	    var _this = this;
	    _this.change("search", true);
	    $(".sidebar .form[name='highlight-line'] .item[data-lines='" + lines + "']").remove();
        window.editor.operation(function() {
            $.each(_this.highlightRange(lines), function(key, value) {
                if(typeof value == "number") {
                    window.editor.removeLineClass(value, "text", "CodeMirror-highlighted");
                } else if(typeof value == "object") {
                    for (var line = value.from; line < value.to; line++) {
                        window.editor.removeLineClass(line, "text", "CodeMirror-highlighted");
                    }
                }
            });
        });
	},
	highlightRange: function(lines) {
        return $.map(lines.split(","), function(line) {
            if(line) {
                if(line.indexOf("-") != -1) {
                    line = line.split("-");

                    if(isNaN(line[0]) || isNaN(line[1])) {
                        throw Error("Invalid Lines");
                    } else {
                        return {
                            from: parseInt(line[0]-1),
                            to: parseInt(line[1])
                        }
                    }
                } else {
                    if(isNaN(line)) {
                        throw Error("Invalid Lines");
                    } else {
                        return parseInt(line-1);
                    }
                }
            }
        });
	},
	highlightListing: function(lines) {
	    if(typeof lines == "number") {
	        lines += 1;
	        var lines_formatted = "Line: " + lines;
	    } else {
	        lines = (lines.from + 1) + " - " + lines.to;
	        var lines_formatted = "Lines: " + lines;
	    }

    	$(".sidebar .form[name='highlight-line'] .listing")
    	    .append("                                                                       \
                <div class='item' data-lines='" + lines + "'>                               \
                    <div class='name'>" + lines_formatted + "</div>                         \
                    <div class='remove " + window.config.icons.cross_square + "'></div>     \
                </div>                                                                      \
    	    ");
	},
	search: function(search) {
    	if(search && window.editor.getValue().length != 0) {
    	    try {
        	    var _this = this;
        	    this.change("search", true);

        	    window.editor.operation(function() {
                    var key = Math.floor((Math.random()*10000)+1);
                    var color = randomFunctionalColor();

                    _this.searchList[key] = [];
                    _this.searchListing(key, search);

                    $("<style type='text/css'>.s" + key + "{background:" + color + ";}</style>").appendTo("head");

                    for (var cursor = window.editor.getSearchCursor(search); cursor.findNext();) {
                        var marked = window.editor.markText(cursor.from(), cursor.to(), {
                            "className": "s" + key
                        });

                        _this.searchList[key].push(marked);
                    }
                });
            } catch(error) {
                return error;
            }
        }
	},
	searchRemove: function(search) {
	    var _this = this;
        var state = _this.searchList[parseInt(search)];
        window.editor.operation(function() {
            for (var i = 0; i < state.length; ++i) {
                    state[i].clear();
            }
            delete _this.searchList[parseInt(search)];
            $(".sidebar .form[name='highlight-word'] .item[data-search='" + search + "']")
                .remove();
        });
	},
	searchListing: function(key, search) {
    	$(".sidebar .form[name='highlight-word'] .listing")
    	    .append("                                                                       \
                <div class='item' data-search='" + key + "'>                                \
                    <div class='name'>" + $('<div/>').text(search).html() + "</div>         \
                    <div class='remove " + window.config.icons.cross_square + "'></div>     \
                </div>                                                                      \
    	    ");
	},
	searchList: {},
	invite: function(screen_name) {
	    var _this = this;
        $.post("/editor/" + url_params()["document"] + "/invite/", {
            screen_name: screen_name,
            access_token: window.editorUtil.access_token,
            _csrf: window.config.csrf
        }, function(json) {
            var error = $(".form[name='invite'] .error_message");

            if(json.success) {
                error.slideUp(200);
                _this.laborators();
            } else {
                error
                    .text(json.error_message.toLowerCase())
                    .slideDown(200);

                _this.inviteTimeout = setTimeout(function() {
                    error.slideUp(200);
                }, 10000);
            }
        });
	},
	inviteTimeout: null,
	laborators: function() {
	    async.parallel({
	        users: function(callback) {
                $.post("/editor/" + url_params()["document"] + "/laborators/", {
                    access_token: window.editorUtil.access_token,
                    _csrf: window.config.csrf
                }, function(json) {
                    callback(json.error_message, json);
                });
	        },
	        online: function(callback) {
	            window.socketUtil.socket.emit("editorLaborators", function(json) {
                    window.editorUtil.users(json.laborators);
                    callback(null, json.laborators);
                });
	        }
	    }, function(error, data) {
            var permissions = $.map(window.config.permissions, function(permission, key) {
                return {
                    id: key,
                    name: permission.toLowerCase(),
                    count: (key == (data.users.permission-1)) ? 1 : 0
                }
            });

    	    $(".sidebar .form[name='invite'] .listing").html("");

            $.each(data.users.laborators, function(key, laborator) {
                if(data.online.indexOf(laborator.id) != -1) {
                    permissions[laborator.permission-1].count++;
                    var item = "active";
                } else if(laborator.permission == 4) {
                    var item = "blocked";
                } else {
                    var item = "";
                }

                if(data.users.permission == 1) {
                    var settings = "settings " + config.icons.settings;
                } else {
                    var settings = "";
                }

                $(".sidebar .form[name='invite'] .listing")
                    .append("                                                           \
                        <div class='item " + item + "'                                  \
                             data-id='" + laborator.id + "'                             \
                             data-permission='" + laborator.permission + "'>            \
                             <div class='gravatar'>                                     \
                                <img src='" + laborator.gravatar + "'>                  \
                             </div>                                                     \
                             <div class='name'>" + laborator.screen_name + "</div>      \
                             <div class='" + settings + "'></div>                       \
                        </div>                                                          \
                    ");

                if(data.users.laborators.end(key)) {
                    var header = [];
                    var delimiter = "<span>" + window.config.delimeter + "</span>";
                    permissions[1].count += permissions[0].count;

                    if(permissions[1].count != 0) {
                        var editors = permissions[1].count + " " + permissions[1].name;
                        if(permissions[1].count != 1) editors += "s";
                        header.push(editors);
                    }

                    if(permissions[2].count != 0) {
                        var viewers = permissions[2].count + " " + permissions[2].name;
                        if(permissions[2].count != 1) viewers += "s";
                        header.push(viewers);
                    }

                    if(!header.empty) {
                        if(permissions[1].count == 1 && permissions[2].count == 0) {
                            $(".chat .controller").text("Chat Room");
                        } else {
                            $(".chat .controller").html(header.join(delimiter));
                        }
                    } else {
                        $(".chat .controller").text("Chat Room");
                    }
                }
            });
	    });
	}
}
