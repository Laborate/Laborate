//User Login
$("#backdropSigIn").live("submit", function() {
    window.passed = true

    $("#backdropSigIn input").each(function() {
        if($(this).val() == "") {
            $(this).css({"border":"solid thin #CC352D"});
            window.passed = false;
        } else {
            $(this).css({"border":""});
        }
    });

    if(window.passed) {
        $("#backdropSigIn input[type=submit]").val("loading...").addClass("disabled");
        $.post("/auth/login/", { user_email: $("#backdropSigIn #backdropSigInEmail").val(),
                                 user_password:$("#backdropSigIn #backdropSigInPassword").val(),
                                 _csrf: $("#_csrf").val()
                               },
            function(result){
                if(result['success']) {
                    window.location.href = "/documents/";
                }
                else {
                    $("#backdropInital .textError").text(result['error_message']).fadeIn();
                    $("#backdropSigIn input[type=submit]").val("Sign In").removeClass("disabled");
                }
            }
        );
    } else {
        $("#backdropSigIn input[type=submit]").val("Sign In").removeClass("disabled");
    }
});


//User Registration
$("#backdropRegister").live("submit", function() {
    $("#backdropRegister input[type=submit]").val("loading...").addClass("disabled");
    $("#backdropInital .textError").fadeOut();
    window.passed = true

    $("#backdropRegister input").each(function() {
        if($(this).val() == "") {
            $(this).css({"border":"solid thin #CC352D"});
            window.passed = false;
        } else {
            if($(this).attr("id") == "backdropRegisterEmail") {
                var element = $(this);
                $.ajax({
                  type: 'POST',
                  url: "/auth/email_check/",
                  data: {
                      user_email: $("#backdropRegister #backdropRegisterEmail").val(),
                      _csrf: $("#_csrf").val()
                  },
                  success: success,
                  async: false
                });

                function success(result) {
                    if(result['success']) {
                        element.css({"border":""});
                    } else {
                        element.css({"border":"solid thin #CC352D"});
                        $("#backdropInital .textError").text(result['error_message']).fadeIn();
                        window.passed = false;
                    }

                }
            } else if($(this).attr("id") == "backdropRegisterConfirm") {
                if($("#backdropRegister #backdropRegisterPassword").val() ==  $("#backdropRegister #backdropRegisterConfirm").val()) {
                    $("#backdropRegister #backdropRegisterPassword").css({"border":""});
                    $("#backdropRegister #backdropRegisterConfirm").css({"border":""});
                }
                else {
                    $("#backdropRegister #backdropRegisterPassword").css({"border":"solid thin #CC352D"});
                    $("#backdropRegister #backdropRegisterConfirm").css({"border":"solid thin #CC352D"});
                    $("#backdropInital .textError").text("Passwords Do Not Match").fadeIn();
                    window.passed = false;
                }
            } else {
                $(this).css({"border":""});
            }
        }
    });

    if(window.passed) {
        $.post("/auth/register/", { user_name: $("#backdropRegister #backdropRegisterName").val(),
                                    user_screen_name: $("#backdropRegister #backdropRegisterScreenName").val(),
                                    user_email: $("#backdropRegister #backdropRegisterEmail").val(),
                                    user_password: $("#backdropRegister #backdropRegisterPassword").val(),
                                    _csrf: $("#_csrf").val()
                                  },
            function(result){
                if(result['success']) {
                    window.location.href = "/documents/";
                }
                else {
                   $("#backdropInital .textError").text(result['error_message']).fadeIn();
                   $("#backdropRegister input[type=submit]").val("Register").removeClass("disabled");
                }

            }
        );
    } else {
        $("#backdropRegister input[type=submit]").val("Register").removeClass("disabled");
    }
});
