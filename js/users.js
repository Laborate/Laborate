function userBlock (id, name, remove) {
    if(remove && $.inArray(id, window.users) > -1) {
        $("#document_contributors").find("[data=" + id + "]").remove();
        delete window.users[$.inArray(id, window.users)];

        window.editor.operation(function() {
            for (var i = 0; i < window.editor.lineCount(); ++i) {
                window.editor.setLineClass(i, "");
            }
        });
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
}

$(".contributor").live("hover", function(){
    $("#contributor_info #contributor_info_name").text($(this).attr("username"));
    if($(this).index() == 0) { var extra = 0; }
    else { var extra = 5; }
    var contributor_box_offset = $(this).offset().left - ($(this).width()/2);
    var contributor_info = $("#contributor_info").width()/2;
    $("#contributor_info").show().css("left", (contributor_box_offset - contributor_info) + "px");
});

$(".contributor").live("mouseout", function(){
    $("#contributor_info").hide().css("left", "0px");
    $("#contributor_info #contributor_info_name").text("");
});

function usersCursors(id, line, remove) {
    if(remove) {
        window.editor.setLineClass(window.cursors[id], "");
        delete window.cursors[id];
    }
    else {
        if(id in window.cursors) {
            window.editor.setLineClass(window.cursors[id], "");
        }
        window.editor.setLineClass(line, ("u"+id));
        window.cursors[id] = line;
    }
}