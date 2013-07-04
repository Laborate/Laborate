/////////////////////////////////////////////////
//          Editor Instances
/////////////////////////////////////////////////
$(window).ready(function() {
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
            var info = window.editor.lineInfo(parseInt(data["line"]));
            var marker = document.createElement("div");
            marker.className ="CodeMirror-breakpoint";
            marker.innerHTML = "●";
            if(direction == "out") {
                window.editor.setGutterMarker(data["line"], "breakpoints", info.gutterMarkers ? null : marker);
                window.nodeSocket.emit( 'editor' , {"from": window.userId, "extras": {"breakpoint": {"line":data["line"], "remove":info.gutterMarkers}}} );
            }

            if(direction == "in") {
                window.editor.setGutterMarker(data["line"], "breakpoints", data["remove"] ? null : marker);
            }
        },
        join: function(name, password) {
            window.screenName = name;
            $.cookie("screenName", name);
            window.nodeSocket.emit('join', {"from":window.userId, "name": name,
                                        "session": window.url_params()["document"], "password": password});
        },
        users: function(data) {
            if(data['leave'] && $.inArray(data['from'], window.users) > -1) {
                $("#document_contributors").find("[data=" + data['from'] + "]").remove();
                window.users.splice(window.users.indexOf(data['from']), 1);
            }
            else {
                if($.inArray(data['from'], window.users) == -1) {
                    $("<style type='text/css'> .u" + data['from'] + "{background:" + randomUserColor() + " !important;} </style>").appendTo("head");
                    var contributor = '<div class="contributor u'+data['from']+'" data="'+data['from']+'" userName="'+data['name']+'"></div>';
                    $("#document_contributors").append(contributor);
                    window.users.push(data['from']);
                }
                else {
                    $("#document_contributors").find("[data=" + data['from'] + "]").attr("userName", data['name']);
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
                if(data['leave']) {
                    window.nodeSocket.emit('cursors' , {"from":window.userId, "leave":true} );
                } else {
                    window.nodeSocket.emit('cursors' , {"from":window.userId, "line":data['line']} );
                }
            }

            if(direction == "in") {
                if(data['leave']) {
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
        }
    }
});
