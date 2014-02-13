$(function() {
    $("#classroom #backdrop-header div").vAlign();

    $("#slider")
        .html(Array(6).join("<div><div></div></div>"))
        .vAlign()
        .find("div").eq(0)
        .addClass("active");

    $(".refer-form").on("submit", function() {
        var _this = $(this),
            input = _this.find("input[type=text]"),
            button = _this.find("input[type=submit]");

        if(input.val()) {
            $.post(_this.attr("action"), {
                _csrf: window.config.csrf,
                email: input.val()
            });

            input.val("");
            button.addClass("success").val("Thanks!");

            setTimeout(function() {
                button.removeClass("success").val("Refer");
            }, 3000);
        }

        return false;
    });

    $("#slider").on("click", "div", function() {
        var slide = $(".slide").eq($(this).index());
        $('html, body').scrollTop(slide.offset().top - slide.outerHeight(true)/3);
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
        var editor = CodeMirror.fromTextArea(this);
        editor.setOption("mode", "python");
        CodeMirror.autoLoadMode(editor, "python");

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
