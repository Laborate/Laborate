window.backdrop = {
    ready: function() {
        $("#backdrop-core").vAlign().hAlign().show();
        $(".backdrop-input").attr({"spellcheck": false});
    },
    submit: function() {
        var passed = true;
        var data = { _csrf: window.config.csrf }
        var submit = $("#backdrop input[type=submit]").val();

        $(".backdrop-input").each(function() {
            passed = (passed) ? !!$(this).val() : passed;
            data[$(this).attr("name")] = $(this).val();
            if($(this).val()) {
                $(this).removeClass("error");
            } else {
                $(this).addClass("error");
            }
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
                    $("#backdrop input[type=submit]").val(result.error_message).removeClass("disabled").addClass("error");
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
            $(".backdrop-container")
                .width("320px")
                .html(
                    $(".backdropInitalWelcome")
                        .removeClass("seperatorRequired")
                        .html(message)[0]
                );

            $("#backdrop-core").hAlign().vAlign();

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
    },
    profileImg: function() {
        $("#backdrop-profile").attr("src", ("https://www.gravatar.com/avatar/" +
                                            CryptoJS.MD5($("#backdrop-email").val()).toString() +
                                            "?s=150&d=http%3A%2F%2F" + window.config.host + "%2Fimg%2Fdefault_gravatar.jpeg"));
    }
}

$(document).ready(window.backdrop.ready);
$("#backdrop form").live("submit", window.backdrop.submit);
$("#backdrop-email").live("blur", window.backdrop.profileImg);
