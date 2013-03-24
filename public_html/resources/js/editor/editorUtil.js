/////////////////////////////////////////////////
//          Editor Instances
/////////////////////////////////////////////////
window.editorUtil = {
    clean: true,
    setChanges: function(direction, data) {
        if(data['origin'] != "setValue") {
            if(direction == "out") {
                if(window.editorUtil.clean) {
                    window.nodeSocket.emit( 'editor' , { "from": window.userId, "changes": data } );
                } else {
                    window.editorUtil.clean = true;
                }
            }

            if(direction == "in") {
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
        var info = window.editor.lineInfo(data["line"]);
        var marker = document.createElement("div");
        marker.className ="CodeMirror-breakpoint";
        marker.innerHTML = "●";
        if(direction == "out") {
            window.editor.setGutterMarker(data["line"], "breakpoints", info.gutterMarkers ? null : marker);
            window.nodeSocket.emit( 'editor' , {"from": window.userId, "extras": {"lineMarker": {"line":data["line"], "remove":info.gutterMarkers}}} );
        }

        if(direction == "in") {
            window.editor.setGutterMarker(data["line"], "breakpoints", data["remove"] ? null : marker);
        }
    },
    users: function(id, name, remove) {
        if(remove && $.inArray(id, window.users) > -1) {
            $("#document_contributors").find("[data=" + id + "]").remove();
            delete window.users[id];
            window.editorUtil.userCursors("in", {"from":id, "remove":true})
        }
        else {
            if($.inArray(id, window.users) == -1) {
                $("<style type='text/css'> .u" + id + "{background:" + randomUserColor() + " !important;} </style>").appendTo("head");
                var contributor = '<div class="contributor u'+id+'" data="'+id+'" userName="'+name+'"></div>';
                $("#document_contributors").append(contributor);
                window.users.push(id);
            }
            else {
                $("#document_contributors").find("[data=" + id + "]").attr("userName", name);
            }
        }
    },
    userHover: function(element) {
        $("#contributor_info #contributor_info_name").text(element.attr("username"));
        if(element.index() == 0) { var extra = 0; }
        else { var extra = 5; }
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
            if(data['remove']) {
                window.nodeSocket.emit('cursors' , {"from":window.userId, "remove":true} );
            } else {
                window.nodeSocket.emit('cursors' , {"from":window.userId, "line":data['line']} );
            }
        }

        if(direction == "in") {
            if(data['remove']) {
                window.editor.removeLineClass(window.cursors[data['from']], "", ("u"+data['from']));
                delete window.cursors[data['from']];
            }
            else {
                if(data['from'] in window.cursors) {
                    window.editor.removeLineClass(window.cursors[data['from']], "", ("u"+data['from']));
                }
                window.editor.addLineClass(data['line'], "", ("u"+data['from']));
                window.cursors[data['from']] = data['line'];
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
            $("#full_screen").addClass("icon-contract");
            $("#full_screen").removeClass("icon-expand");
            $("#full_screen").css({"font-size": "24px", "margin": "0 0 0 30px"});
            $("#sidebar, #header, #chatRoom").hide();
        } else {
            $("#editorCodeMirror").css({"margin": "", "width": ""});
            $("#full_screen").addClass("icon-expand");
            $("#full_screen").removeClass("icon-contract");
            $("#full_screen").css({"font-size": "", "margin": ""});
            $("#sidebar, #header, #chatRoom").show();
        }

        window.editor.refresh();
        window.editorUtil.refresh();
    }
}