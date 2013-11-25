window.sidebarUtil = {
	change: function(module, permanent) {
	    var element = $(".sidebar .list .item[data-key='" + module + "']");
	    if(module != false && (permanent || !element.hasClass("activated"))) {
	        $(".sidebar").addClass("menu");
	        $(".sidebar .pane .item").hide();
	        $(".sidebar .list .item").removeClass("activated");
	        element.addClass("activated");
            $(".sidebar .pane .item[data-key='" + module + "']").show();
            $(".sidebar .controller .title").text(element.find(".name").text());
        } else {
            $(".sidebar").removeClass("menu");
            $(".sidebar .controller .title").text("Menu Panel");
            $(".sidebar .list .item").removeClass("activated");
        }
	},
	submit: function(form) {
        console.log(form);
	},
	populateLanguages: function() {
        var languages = "";
        $.each(window.editorUtil.languages, function(language, mode) {
            languages += "<option value='" + mode + "'>" + language + "</option>";
        });

        $(".form[data-key='settings'] select[name='languages']").html(languages);
	},
	setLanguage: function(language) {
        $(".filter[data-key='file-language'] strong").text(language);
        $(".form[data-key='settings'] select[name='languages']")

        $(".form[data-key='settings'] select[name='languages'] option")
            .filter(function() {
                return ($(this).text() == language);
            })
            .prop('selected', true);
	},
	keyMap: function(map) {
		if(map != "" && map != undefined) {
			window.editor.setOption("keyMap", map);
			$.cookie("keyMap", map);
		}
	},
	format: function(whole_document) {
		for(var i = 0; i<= window.editor.lineCount(); i++) {
			window.editor.indentLine(i);
		}

		window.editor.refresh();
	},
	highlight: function(line) {
		this.change('search', true);
		if(line.length != 0 && window.editor.getValue().length != 0 && /[^0-9,-]/.test(line) == false) {
			var lines = line.split(",");
			var part1 = "<div class='header clear'>";
			part1 += "<div class='listColor' style='background:#B4D5E8;'></div>";
			part1 += "<div class='left'>";
			var part2 = "</div><div class='listX right'></div>";
			part2 += "<div class='clear'></div>";

			for (var a = 0; a < lines.length; ++a) {
				var line = $.trim(lines[a]);
				var alreadyThere = false;

				$.each($("#lineNumberList .header"), function() {
					if($(this).find(".listContent").text() == line) {
						alreadyThere = true;
					}
				});

				if(line.length != 0 && !alreadyThere) {
					lineSplit = line.split("-");

					if(lineSplit.length == 1) {
						var range = [parseInt(line)];
						$("#lineNumberList").append(part1 + "<span class='listContent'>" + lineSplit[0] + "</span>" + part2);
					}
					else {
						var range = createRange(parseInt(lineSplit[0]), parseInt(lineSplit[1]) + 1.0);
						$("#lineNumberList").append(part1 + "<span class='listContent'>" + lineSplit[0] + "-" + lineSplit[1] + "</span>" + part2);
					}

					for (var b = 0; b < range.length; ++b) {
						window.editor.addLineClass(range[b] - 1, "", "CodeMirror-highlighted");

					}
				}
			}
		}
	},
	highlightRemove: function(parent) {
		var lineSplit = parent.find(".listContent").text().split("-");
		parent.remove();

		if(lineSplit.length == 1) { range = [parseInt(lineSplit[0])];}
		else { range = createRange(parseInt(lineSplit[0]), parseInt(lineSplit[1]) + 1.0); }

		for (var c = 0; c < range.length; ++c) {
			window.editor.removeLineClass(range[c] - 1, "", "CodeMirror-highlighted");
		}
	},
	search: function(pattern) {
		this.change('search', true);
		var alreadyThere = false;

		$.each($("#findList .header"), function() {
			if($(this).find(".listContent").text() == pattern) {
				alreadyThere = true;
			}
		});

		if(pattern.length != 0 && window.editor.getValue().length != 0 && !alreadyThere) {
			function SearchState() {
				this.posFrom = this.posTo = this.query = null;
				this.marked = [];
			}

			function getSearchState() {
				return window.editor._searchState || (window.editor._searchState = new SearchState());
			}

			window.searchList = window.searchList || {}
			var key = Math.floor((Math.random()*10000)+1);
			window.searchList[key] = new Array();
			color = randomFunctionalColor();
			$("<style type='text/css'> .h" + key + "{background:" + color + ";} </style>").appendTo("head");
			for (var cursor = window.editor.getSearchCursor(pattern); cursor.findNext();) {
				marked = window.editor.markText(cursor.from(), cursor.to(), {"className": "h" + key})
				window.searchList[key].push(marked);
				getSearchState().marked.push(marked);
			}

			var li = "<div class='header clear " + key + "'>";
			li += "<div class='listColor' style='background:" + color + "'></div>";
			li += "<div class='listContent left'></div>" ;
			li += "<div class='listX right' data='" + key + "'></div>";
			li += "<div class='clear'></div>";
			$("#findList").append(li).find("." + key + " .listContent").text(pattern);
			$("#findList").find("." + key).removeClass(key + "");
			var state = getSearchState();
			state.query = null;
			state.marked.length = 0;
		}
	},
	searchRemove: function(element) {
		var state = window.searchList[parseInt(element.attr("data"))];
		for (var i = 0; i < state.length; ++i) {
			state[i].clear();
		}
		delete window.searchList[parseInt(element.attr("data"))];
		element.parent().remove();
	},
	jumpToLine: function(line) {
	    this.change('search', true);
		window.editor.scrollIntoView({"line": (line - 1), "ch":0});
		window.editor.addLineClass((line - 1), "", "CodeMirror-linejump ");

		setTimeout(function() {
            window.editor.removeLineClass((line - 1), "", "CodeMirror-linejump ");
		}, 3000);

	},
	setTitle: function(direction, title) {
		$("#documentTitle").val(title);
		$("#document_title").text(title);
		setEditorMode(title.split(".")[title.split(".").length - 1]);
		$("title").text(title + window.config.delimeter + window.config.name);
		if(direction == "out") {
    		window.socketUtil.socket.emit('editorExtras' , {
    		    "docName": $("#documentTitle").val()
            });
        }
	},
	settings: function() {
	    $("#settingsSave").removeClass("red_harsh").addClass("disabled").val("Saving...");
        window.sidebarUtil.keyMap($("#keyMap").val());
        $.post("/editor/" + window.url_params()["document"] + "/update/", {
            name: $("#documentTitle").val(),
            password: $("#documentPassword").val(),
            change_password: $("#change_password").val(),
            access_token: window.editorUtil.access_token,
            _csrf: window.config.csrf
        }, function(json) {
            if(json.success) {
                if($("#change_password").val() == "true") {
                    window.editorUtil.access_token = json.hash;
                    window.socketUtil.socket.emit('editorExtras', {
                            "passChange": true,
                            "passOpen": ($("#documentPassword").val() == "")
                    });
                }
                window.sidebarUtil.setTitle("out", $("#documentTitle").val());
                $("#settingsSave").removeClass("red_harsh disabled").val("Settings Saved");
                setTimeout(function() {
                    window.sidebarUtil.togglePassword(true);
                }, 100);
                setTimeout(function() {
                    $("#settingsSave").val("Save Settings");
                }, 5000);

            } else {
               $("#settingsSave").removeClass("disabled").addClass("red_harsh").val("Failed To Save");
               setTimeout(function() {
                    $("#settingsSave").removeClass("red_harsh").val("Save Settings");
                    window.sidebarUtil.togglePassword(true);
                }, 5000);
            }
        });
	},
	remove: function() {
	    var input_val = $("#removeDoc").val();
	    $("#removeDoc").addClass("disabled").val("Removing...");
    	$.post("/editor/" + window.url_params()["document"] + "/remove/", {
            access_token: window.editorUtil.access_token,
            _csrf: window.config.csrf
        }, function(json) {
            if(json.success) {
                if(json.master) {
                    window.socketUtil.socket.emit('editorExtras', {
                            "docDelete": true
                    });
                }
                window.location.href = "/documents/";
            } else {
               $("#removeDoc").removeClass("disabled").addClass("red_harsh").val("Failed To Remove");
            }

            setTimeout(function() {
                $("#removeDoc").removeClass("red_harsh").val(input_val);
            }, 5000);
        });
	},
	copy_button: function() {
    	$("#shareCopy").zclip({
            path:'/flash/copy.swf',
            copy: window.location.href,
            afterCopy: function() {
                $("#shareCopy").val("Copied");
                setTimeout(function() {
                    $("#shareCopy").val("Copy Invite Url");
                }, 5000);
            }
        });
	},
	togglePassword: function(reset) {
        if(!$("#documentPassword").is(":disabled") || reset == true) {
            $("#documentPassword").attr("disabled", "disabled").val("");
            $("#change_password").val("false");
            $("#password_change")
                .removeClass("icon-cancel")
                .addClass("icon-pencil")
                .css("cssText", "");
        } else {
            $("#documentPassword").removeAttr("disabled").val("");
            $("#change_password").val("true");
            $("#password_change")
                .removeClass("icon-pencil")
                .addClass("icon-cancel")
                .css("cssText", "border: solid 1px #999 !important;");
        }
	},
	email_invite: function() {
    	if($("#emailAddresses").val() != "") {
            $("#emailSend").addClass("disabled").val("Sending...");
            $("#sidebar_share .header").eq(0).css("color", "");
            $("#emailAddresses").css("border", "");

            $.post("/editor/" + url_params()["document"] + "/invite/", {
                addresses: $("#emailAddresses").val(),
                message: $("#emailMessage").val(),
                access_token: window.editorUtil.access_token,
                _csrf: window.config.csrf
            }, function(json) {
                 if(json.success) {
                     $("#emailAddresses, #emailMessage").val("");
                     $("#emailSend").removeClass("disabled").val("Email Sent");
                 }
                 else {
                     $("#emailSend").removeClass("disabled").val("Email Failed").addClass("red_harsh");
                 }

                 setTimeout(function() {
                    $("#emailSend").val("Send Email").removeClass("red_harsh");
                 }, 5000);
             });
        } else {
            $("#sidebar_share .header").eq(0).css("color", "#F10F00");
            $("#emailAddresses").css("border", "solid 1px #F10F00");
            $("#emailSend").val("Missing Information").addClass("red_harsh");
            setTimeout(function() {
                $("#sidebar_share .header").eq(0).css("color", "");
                $("#emailAddresses").css("border", "");
                $("#emailSend").val("Send Email").removeClass("red_harsh");
            }, 5000);
        }
	},
	downloadFile: function() {
		var url = "/editor/" + window.url_params()["document"] + "/download/";
		url += (window.editorUtil.access_token) ? (window.editorUtil.access_token + "/") : "";

        $("#downloadFile").addClass("disabled").val("Downloading...");
		$.fileDownload(url, {
            successCallback: function (url) {
                $("#downloadFile").removeClass("disabled red_harsh").val("Download File");
            },
            failCallback: function (responseHtml, url) {
                $("#downloadFile").removeClass("disabled").addClass("red_harsh").val("Download Failed");

                setTimeout(function() {
                    $("#downloadFile").removeClass("disabled red_harsh").val("Download File");
                }, 5000);
            }
		}).done(function() {

		});
    },
    commitFile: function() {
        $("#githubCommit").removeClass("red_harsh").addClass("disabled").val("Commiting...");
        $.post("/editor/" + url_params()["document"] + "/commit/", {
            message: $("#githubMessage").val(),
            _csrf: window.config.csrf
        }, function(json) {
             if(json.success) {
                 $("#githubMessage").val("");
                 $("#githubCommit").removeClass("disabled").val("File Commited");
             }
             else {
                 $("#githubCommit").removeClass("disabled").val("Commit Failed").addClass("red_harsh");
             }

             setTimeout(function() {
                $("#githubCommit").val("Commit File").removeClass("red_harsh");
             }, 5000);
         });
	},
	pushFile: function() {
		$("#saveToServer").removeClass("red_harsh").addClass("disabled").val("Saving...");
	}
}
