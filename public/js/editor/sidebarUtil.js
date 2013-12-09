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
                this.invite(form);
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
        $(".filter[data-key='file-language'] strong").text(language);
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
    		$.cookie("keyMap", keymap);
        }
	},
	setTitle: function(direction, title) {
	    var extension = title.split(".")[title.split(".").length - 1];
	    window.editorUtil.setModeExtension(extension);

		$("#documentTitle").val(title);
		$("#document_title").text(title);
		$("title").text(title + window.config.delimeter + window.config.name);
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
	    line -= 1;
        window.editor.scrollIntoView({
            line: line,
            ch: 0
        });

        window.editor.addLineClass(line, "text", "CodeMirror-linejump");
        setTimeout(function() {
            window.editor.removeLineClass(line, "text", "CodeMirror-linejump");
        }, 5000);
	},
	highlight: function(lines) {
	    if(lines && window.editor.getValue().length != 0) {
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
            if(line.indexOf("-") != -1) {
                line = line.split("-");
                return {
                    from: parseInt(line[0]-1),
                    to: parseInt(line[1])
                }
            } else {
                return parseInt(line-1);
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
    	    var _this = this;
    	    this.change("search", true);

    	    window.editor.operation(function() {
                var key = Math.floor((Math.random()*10000)+1);
                var color = randomFunctionalColor();

                _this.searchList[key] = [];
                $("<style type='text/css'>.s" + key + "{background:" + color + ";}</style>").appendTo("head");

                for (var cursor = window.editor.getSearchCursor(search); cursor.findNext();) {
                    var marked = window.editor.markText(cursor.from(), cursor.to(), {
                        "className": "s" + key
                    });

                    _this.searchList[key].push(marked);
                    _this.searchGetState().marked.push(marked);
                }

                $(".sidebar .form[name='highlight-word'] .listing")
            	    .append("                                                                       \
                        <div class='item' data-search='" + key + "'>                                \
                            <div class='name'>" + search + "</div>                                  \
                            <div class='remove " + window.config.icons.cross_square + "'></div>     \
                        </div>                                                                      \
            	    ");

                var state = _this.searchGetState();
                state.query = null;
                state.marked.length = 0;
            });
        }
	},
	searchRemove: function(search) {
        var state = this.searchList[parseInt(search)];
        window.editor.operation(function() {
            for (var i = 0; i < state.length; ++i) {
                    state[i].clear();
            }
            delete state;
            $(".sidebar .form[name='highlight-word'] .item[data-search='" + search + "']")
                .remove();
        });
	},
	searchList: {},
	searchNewState: function() {
    	this.posFrom = this.posTo = this.query = null;
        this.marked = [];
	},
	searchGetState: function() {
    	return window.editor._searchState || (window.editor._searchState = new this.searchNewState());
	}
}
