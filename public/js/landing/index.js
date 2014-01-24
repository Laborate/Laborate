$(function() {
    $("#classroom #backdrop-header div").vAlign();

    $("#slider")
        .html(Array(6).join("<div><div></div></div>"))
        .vAlign()
        .find("div").eq(0)
        .addClass("active");


    $("#slider").on("click", "div", function() {
        if(!$(this).hasClass("active")) {
            var slide = $(".slide").eq($(this).index());

            $('html, body').scrollTop(slide.offset().top - slide.outerHeight(true)/2);
        }
    });

    $('.slide').each(function() {
        var slide = $(this);
        slide.waypoint(function(direction) {
            if(window.movie) {
                if($(this).attr("id") == "classroom") {
                    setTimeout(function() {
                        if(slide.hasClass('active')) {
                            window.movie.play();
                        }
                    }, 100);
                } else {
                    window.movie.stop();
                    window.movie._editor.setValue("");
                }
            }

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
        styleActiveLine: false,
        mode: "text/x-java"
    }

    $(".editor").each(function() {
        if($(this).hasClass("movie")) {
            window.movie = CodeMirror.movie(this);
            window.movie.stop();

            var editor = window.movie._editor;
        } else {
            var editor = CodeMirror.fromTextArea(this);
        }

        $(this).parent().height(
            $(this).parent().parent().height() - $("#backdrop-header").outerHeight(true)
        );

        $.each(CodeMirror.settings, function(key, value) {
            editor.setOption(key, value);
        });

        editor.refresh();
        CodeMirror.autoLoadMode(editor, "clike");
    });
});

$(window).load(function() {
    $("#backdrop-img").fadeIn(350);
});
