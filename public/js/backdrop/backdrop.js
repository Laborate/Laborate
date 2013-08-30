window.backdrop = {
    ready: function() {
        $("#backdropCore").vAlign().hAlign().show();
        $("#backdrop input[type=text]").attr({"spellcheck": false});
    },
    submit: function() {
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
                        $("#backdrop .textError").hide();
                    }
                }
                else {
                    $("#backdrop .textError").text(result.error_message).fadeIn();
                    $("#backdrop input[type=submit]").val(submit).removeClass("disabled");
                }
            });
        }

        return false;
    },
    error: function(message, url) {
        if(message) {
            $("#backdrop .textError").hide();
            $("body > *").not("#backdrop").remove();
            $("#backdrop").show();
            $(".backdropContainer")
                .width("320px")
                .html(
                    $(".backdropInitalWelcome")
                        .removeClass("seperatorRequired")
                        .html(message)[0]
                );

            $("#backdropCore").hAlign().vAlign();

            if(url) {
                if(url == true) {
                    setTimeout(function() {
                        window.location.reload(true);
                    }, 5000);
                } else {
                    setTimeout(function() {
                        window.location.href = url;
                    }, 30000);
                }
            }
        } else {
            window.location.href = (url) ? url : "/documents/";
        }
    },
    urlChange: function(url) {
        window.location.href = url;
    }
}

$(window).ready(window.backdrop.ready);
$("#backdrop form").live("submit", window.backdrop.submit);
