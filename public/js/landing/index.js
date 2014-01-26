$(function() {
    $("#classroom #backdrop-header div").vAlign();

    $("#slider")
        .html(Array(6).join("<div><div></div></div>"))
        .vAlign()
        .find("div").eq(0)
        .addClass("active");


    $("#slider").on("click", "div", function() {
        var slide = $(".slide").eq($(this).index());
        $('html, body').scrollTop(slide.offset().top - slide.outerHeight(true)/3);
    });

    $('.slide').each(function() {
        var slide = $(this);
        slide.waypoint(function(direction) {
            if(window.movie) {
                if(slide.attr("id") == "classroom") {
                    setTimeout(function() {
                        if(slide.hasClass('active')) {
                            window.movie.play();
                        }
                    }, 100);
                } else {
                    window.movie.stop();
                }
            }

            $("#slider > div")
                .removeClass("active")
                .eq(slide.index())
                .addClass("active");

            $('.slide').removeClass("active");
            slide.addClass("active");
        }, {
            offset: (slide.index() == 0) ? -50 : slide.height()/1.5
        });
    });

    CodeMirror.modeURL = "/codemirror/mode/%N/%N.js";
    CodeMirror.settings = {
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
    }

    $(".editor").each(function() {
        if($(this).hasClass("movie")) {
            window.movie = CodeMirror.movie(this);
            window.movie.stop();

            var editor = window.movie._editor;
            editor.setOption("mode", "python");
            CodeMirror.autoLoadMode(editor, "python");
        } else {
            var editor = CodeMirror.fromTextArea(this);
            editor.setOption("mode", "text/x-java");
            CodeMirror.autoLoadMode(editor, "clike");
        }

        $(this).parent().height(
            $(this).parent().parent().height() - $("#backdrop-header").outerHeight(true)
        );

        $.each(CodeMirror.settings, function(key, value) {
            editor.setOption(key, value);
        });

        editor.refresh();
    });
});

$(window).load(function() {
    $("#backdrop-img").fadeIn(350);
});
