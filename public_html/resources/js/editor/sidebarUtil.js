window.sidebarUtil = {
    keyMap: function(map) {
        if(map != "" && map != undefined) {
            window.editor.setOption("keyMap", map);
            $.cookie("keyMap", map);
        }
    },
    format: function(whole_document) {
        if(whole_document) {
            start = {"ch":0, "line": 0};
            end = {"ch":editor.getValue().length, "line": editor.lineCount()};
        }
        else {
            start = editor.getCursor("start");
            end = editor.getCursor();
        }
        editor.lineNumberFormatter(start, end);
        editor.autoIndentRange(start, end);
        editor.refresh();
        editor.setSelection(editor.getCursor(), editor.getCursor());
    },
    highlight: function(line) {
        sidebar('find');
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
        sidebar('find');
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
                return editor._searchState || (editor._searchState = new SearchState());
            }

            window.searchList = window.searchList || {}
            var key = Math.floor((Math.random()*10000)+1);
            window.searchList[key] = new Array();
            color = randomFunctionalColor();
            $("<style type='text/css'> .h" + key + "{background:" + color + ";} </style>").appendTo("head");
            for (var cursor = editor.getSearchCursor(pattern); cursor.findNext();) {
                marked = editor.markText(cursor.from(), cursor.to(), {"className": "h" + key})
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
    scroll: function(i) {
        window.editor.scrollIntoView({"ch":"0", "line": (i - 1) + ""}, 500)
    },
    setTitle: function(title) {
        $("#documentTitle").val(title);
        $("#document_title").text(title);
        setEditorMode(title.split(".")[title.split(".").length - 1]);
        $("title").text(title + " · Code-Laborate");
        window.nodeSocket.emit( 'editor' , {"from": window.userId, "extras": {"docName": $("#documentTitle").val()}} );
    },
    passwordCheck: function(callback) {
        $.post("/php/session/password_check.php", { session_id: getUrlVars()['i'], session_password: $("#backdropPassword").val() },
            function(password_response){
                if(password_response != "Password Authentication: Failed") {
                    callback(password_response);
                }
                else {
                    callback(false);
                }
            }
        );
    },
    downloadFile: function() {
        $("#downloadFile").removeClass("red_harsh").addClass("disabled").val("Downloading File...");
        window.sidebarUtil.passwordCheck(function(callback) {
            $("#downloadFile").removeClass("disabled");
            if(callback) {
                window.location.href = "/php/session/download_file.php?i=" + callback;
            }
            else {
                $("#downloadFile").addClass("red_harsh").val("Download Failed");
                setTimeout(function() {
            		$("#downloadFile").removeClass("red_harsh").val("Download File");
        		}, 5000);
            }
        });
    },
    printFile: function() {
        $("#printButton").removeClass("red_harsh").addClass("disabled").val("Printing File...");
        window.sidebarUtil.passwordCheck(function(callback) {
            $("#printButton").removeClass("disabled");
            if(callback) {
                var url = "/print/?i="+ callback + "&t=" + $("#document_title").text();
                printWindow = window.open(url, 'title', 'width=800, height=500, menubar=no,location=no,resizable=no,scrollbars=no,status=no');
            } else {
                $("#printButton").addClass("red_harsh").val("Print Failed");
                setTimeout(function() {
            		$("#printButton").removeClass("red_harsh").val("Print Document");
        		}, 5000);
            }
        });
    },
    commitFile: function() {
        $("#githubCommit").removeClass("red_harsh").addClass("disabled").val("Commiting File...");
        window.sidebarUtil.passwordCheck(function(callback) {
            if(callback) {
                if($("#githubReference").val() != "") { var related = "\n\Issue: #" + $("#githubReference").val(); }
                else { var related = ""; }
                $.post("/php/locations/github_commit.php", { commit_id: callback,
                                                                   session_document: window.editor.getValue(),
                                                                   message: $("#githubMessage").val() + related },
                    function(result){
                        $("#githubCommit").removeClass("disabled");
                        if(result == "Commit Succeeded") {
                            $("#githubCommit").val("File Commited").removeClass("red_harsh");
                            $("#githubMessage, #githubReference").val("");
                            setTimeout(function() {
                        		$("#githubCommit").removeClass("red_harsh").val("Commit File");
                    		}, 5000);
                        }
                        else {
                            $("#githubCommit").addClass("red_harsh").val("Commit Failed");
                            setTimeout(function() {
                                $("#githubCommit").removeClass("red_harsh").val("Commit File");
                            }, 5000);
                        }
                    }
                );
            }
            else {
                $("#githubCommit").removeClass("disabled").addClass("red_harsh").val("Commit Failed");
                setTimeout(function() {
                    $("#githubCommit").removeClass("red_harsh").val("Commit File");
                }, 5000);
            }
        });
    },
    pushFile: function() {
        $("#saveToServer").removeClass("red_harsh").addClass("disabled").val("Saving File...");
        window.sidebarUtil.passwordCheck(function(callback) {
            if(callback) {
                $.post("/php/locations/sftp_push.php", {
                                                        commit_id: callback,
                                                        session_document: window.editor.getValue(),
                                        },
                    function(result){
                        $("#saveToServer").removeClass("disabled");
                        if(result == "File Pushed") {
                            $("#saveToServer").val("File Saved").removeClass("red_harsh");
                            setTimeout(function() {
                        		$("#saveToServer").removeClass("red_harsh").val("Save To Server");
                    		}, 5000);
                        }
                        else {
                            $("#saveToServer").addClass("red_harsh").val("Save Failed");
                            setTimeout(function() {
                        		$("#saveToServer").removeClass("red_harsh").val("Save To Server");
                    		}, 5000);
                        }
                    }
                );
            }
            else {
                $("#saveToServer").removeClass("disabled").addClass("red_harsh").val("Save Failed");
                setTimeout(function() {
                   $("#saveToServer").removeClass("red_harsh").val("Save To Server");
        		}, 5000);
            }
        });
    }
}