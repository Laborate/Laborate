$(function() {
    $("#classroom #backdrop-header div").vAlign();

    $("#slider")
        .html(Array($(".slide").length).join("<div><div></div></div>"))
        .vAlign();


    $("#slider").on("click", "div", function() {
        var slide = $(".slide").eq($(this).index());

        $('html, body').animate({
            scrollTop: slide.offset().top - slide.outerHeight(true)/2
        }, 500);
    });

    $('.slide').each(function() {
        var slide = $(this);
        slide.waypoint(function(direction) {
            $("#slider > div")
                .removeClass("active")
                .eq(slide.index())
                .addClass("active");

            $('.slide').removeClass("active");
            slide.addClass("active");
        }, {
            offset: (slide.index() == 0) ? -50 : slide.height()
        });
    });

    CodeMirror.modeURL = "/codemirror/mode/%N/%N.js";

    $(".editor").each(function() {
        if($(this).hasClass("movie")) {
            var movie = CodeMirror.movie(this);
        } else {
            var editor = CodeMirror.fromTextArea(this, {
                lineNumbers: true,
                lineWrapping: false,
                matchBrackets: true,
                matchTags: true,
                tabMode: "indent",
                theme: "laborate",
                indentUnit: 4,
                indentWithTabs: true,
                smartIndent: true,
                autofocus: true,
                dragDrop: true,
                autoCloseBrackets: true,
                autoCloseTags: true,
                highlightSelectionMatches: false,
                styleSelectedText: false,
                styleActiveLine: false
            });
            $(this).parent().height($(this).parent().parent().height() - $("#backdrop-header").outerHeight(true));
            editor.setOption("mode", "text/x-java");
            editor.refresh();
            CodeMirror.autoLoadMode(editor, "clike");
        }
    });
});

$(window).load(function() {
    $("#backdrop-img").fadeIn(350);
});
