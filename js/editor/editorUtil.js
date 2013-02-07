$(window).resize(function() {
    //Set ChatRoom Message Height
    var header = parseInt($("#header").height());
    var window_height = parseInt($(window).height());
    $("#editorCodeMirror, .CodeMirror-scroll").height((window_height - header - 38) + "px");
});

setInterval(function(){
    //Set ChatRoom Message Height
    var header = parseInt($("#header").height());
    var window_height = parseInt($(window).height());
    $("#editorCodeMirror, .CodeMirror-scroll").height((window_height - header - 38) + "px");
}, 1000);

function formatCode(whole_document) {
    if(whole_document) {
        start = {"ch":0, "line": 0};
        end = {"ch":editor.getValue().length, "line": editor.lineCount()};
    }
    else {
        start = editor.getCursor("start");
        end = editor.getCursor();
    }
    editor.autoFormatRange(start, end);
    editor.autoIndentRange(start, end);
    editor.refresh();
    editor.setSelection(editor.getCursor(), editor.getCursor());
}

function scrollToLine(i) {
    sidebar('find');
    if(i != "" && i != null && /^\d+$/.test(i)) {
        var l = parseInt(i) - 1;
        editor.setCursor(l);
    }
}

function highLightLine(line) {
    sidebar('find');
    if(line.length != 0 && window.editor.getValue().length != 0 && /[^0-9,-]/.test(line) == false) {
        lines = line.split(",");
        part1 = "<div class='header clear'>";
        part2 = "<div class='listColor' style='background:#B4D5E8;'></div>";
        part3 = "<div class='left'>";
        part4 = "</div><div class='listX right'></div>";
        part5 = "<div class='clear'></div>";

        for (var a = 0; a < lines.length; ++a) {
            line = $.trim(lines[a]);

            if(line.length != 0) {
                lineSplit = line.split("-");

                if(lineSplit.length == 1) {
                    range = [parseInt(line)];
                    $("#lineNumberList").append(part1 + part2 + part3 + "<span class='listContent'>" + lineSplit[0] + "</span>" + part4 + part5);
                }
                else {
                    range = createRange(parseInt(lineSplit[0]), parseInt(lineSplit[1]) + 1.0);
                    $("#lineNumberList").append(part1 + part2 + part3 + "<span class='listContent'>" + lineSplit[0] + "-" + lineSplit[1] + "</span>" + part4 + part5);
                }

                for (var b = 0; b < range.length; ++b) {
                    window.editor.setLineClass(range[b] - 1, "highLightLine");

                }
            }
        }
    }
}

$("#lineNumberList .listX").live("click", function() {
    var parent = $(this).parent();
    var lineSplit = parent.find(".listContent").text().split("-");
    parent.remove();

    if(lineSplit.length == 1) { range = [parseInt(lineSplit[0])];}
    else { range = createRange(parseInt(lineSplit[0]), parseInt(lineSplit[1]) + 1.0); }

    for (var c = 0; c < range.length; ++c) {
        window.editor.setLineClass(range[c] - 1, "");
    }

});

function searchCode(pattern) {
    sidebar('find');
    if(pattern.length != 0 && window.editor.getValue().length != 0) {
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
            marked = editor.markText(cursor.from(), cursor.to(), "h" + key)
            window.searchList[key].push(marked);
            getSearchState().marked.push(marked);
        }
        part1 = "<div class='header clear'>";
        part2 = "<div class='listColor' style='background:" + color + "'></div>";
        part3 = "<div class='left'>";
        part4 = "</div><div class='listX right' data='" + key + "'></div>";
        part5 = "<div class='clear'></div>";
        $("#findList").append(part1 + part2 + part3 + "<span class='listContent'>" + pattern + "</span>" + part4 + part5);
        var state = getSearchState();
        state.query = null;
        state.marked.length = 0;
    }

}

$("#findList .listX").live("click", function() {
    var state = window.searchList[parseInt($(this).attr("data"))];
    for (var i = 0; i < state.length; ++i) {
        state[i].clear();
    }
    delete window.searchList[parseInt($(this).attr("data"))];
    $(this).parent().remove();
});

function setTitle(title, emit) {
    $("#documentTitle").val(title);
    $("#document_title").text(title);
    setEditorMode(title.split(".")[title.split(".").length - 1]);
    $("title").text("Codelaborate - " + title);

    if(emit && window.activated) {
        window.nodeSocket.emit( 'editor' , {"from": window.userId, "extras": {"docName": $("#documentTitle").val()}} );
    }
}