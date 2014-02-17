$(function() {
    $("#classroom #backdrop-header div").vAlign();

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
