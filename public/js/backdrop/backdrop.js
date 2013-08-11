$(window).ready(function() {
	$("#backdropCore").vAlign().hAlign();
    $("#backdrop input[type=text]").attr({"spellcheck": false});
});

$("#backdrop form").live("submit", function() {
    var passed = true;
    var data = { _csrf: window.config.csrf }
    var submit = $("#backdrop input[type=submit]").val();

    $("#backdrop input[type='text'], #backdrop input[type='password']").each(function() {
        passed = (passed) ? !!$(this).val() : passed;
        data[$(this).attr("name")] = $(this).val();
        $(this).css({"border": $(this).val() ? "" : "solid thin #CC352D"});
    });

    if(passed) {
        $("#backdrop input[type=submit]").val("loading...").addClass("disabled");
        $.post($("#backdrop form").attr("action"), data, function(result){
            if(result.success) {
                if(typeof result.next == "string") {
                    window.location.href = result.next;
                } else {
                    if(result.next.arguments) {
                        eval(result.next.function)(result.next.arguments);
                    } else {
                        eval(result.next.function)();
                    }
                }
            }
            else {
                $("#backdrop .textError").text(result.error_message).fadeIn();
                $("#backdrop input[type=submit]").val(submit).removeClass("disabled");
            }
        });
    }

    return false;
});
