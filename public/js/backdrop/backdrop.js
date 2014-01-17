window.backdrop = {
    button: "",
    timer: null,
    email: null,
    ready: function() {
        if($("#backdrop").hasClass("noCenter")) {
            $("#backdrop-core").hAlign().show();
        } else {
            $("#backdrop-core").vAlign().hAlign().show();
            $(".backdrop-input").attr({"spellcheck": false});
        }

        window.backdrop.button = $("#backdrop input[type=submit]").val();
    },
    load: function() {
        $("#backdrop-img").fadeIn(350);
        $("#backdrop-footer").hAlign().show();
    },
    submit: function() {
        var passed = true;
        var data = { _csrf: window.config.csrf }
        clearInterval(window.backdrop.timer);

        $(".backdrop-input, .backdrop-textarea, .backdrop-radio:checked").each(function() {
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
                    if($("#backdrop form").attr("data-error")) {
                        eval($("#backdrop form").attr("data-error"))(result.error_message);
                    } else {
                        $("#backdrop input[type=submit]")
                            .val(result.error_message)
                            .removeClass("disabled")
                            .addClass("error");

                        window.backdrop.timer = setTimeout(function() {
                            $("#backdrop input[type=submit]")
                                .val(window.backdrop.button)
                                .removeClass("error");
                        }, 5000);
                    }
                }
            });
        }

        return false;
    },
    error: function(message, url) {
        if(message) {
            $("#backdrop .textError").hide();
            $("body > *")
                .not("#backdrop")
                .remove();
            $("#backdrop").show();
            $(".backdrop-bottom").hide();
            $("#backdrop-container")
                .css("text-align", "center")
                .width("290px")
                .html(message);

            $("#backdrop-core")
                .hAlign()
                .vAlign();

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
            window.location.href = (url) ? url : "/";
        }
    },
    urlChange: function(url) {
        window.location.href = url;
    },
    profileImg: function() {
        if(window.backdrop.email != $("#backdrop-email").val()) {
            var profile_img = ("https://www.gravatar.com/avatar/" +
                                                CryptoJS.MD5($("#backdrop-email").val()).toString() +
                                                "?s=150&d=404");

            $.ajax({
                url: profile_img,
                complete: function(xhr) {
                    if(xhr.status == 200) {
                        window.backdrop.profileImgChange(profile_img);
                    } else {
                        if($("#backdrop-profile img").attr("src") != "https://www.gravatar.com/avatar/?d=mm") {
                            window.backdrop.profileImgChange("https://www.gravatar.com/avatar/?d=mm");
                        }
                    }

                    window.backdrop.email = $("#backdrop-email").val();
                }
            });
        }
    },
    profileImgChange: function(url) {
        $("#backdrop-profile img").fadeOut(200);

        setTimeout(function() {
            $("#backdrop-profile img")
                .attr("src", url)
                .load(function() {
                    $("#backdrop-profile img").fadeIn(200);
                });
        }, 300);
    }
}

$(document)
    .ready(window.backdrop.ready)
    .on("submit", "#backdrop form", window.backdrop.submit)
    .on("blur change", "#backdrop-email", window.backdrop.profileImg);

$(window).load(window.backdrop.load);
