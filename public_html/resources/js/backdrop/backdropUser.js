//User Login
$("#backdropSigIn").live("submit", function() {
    $("#backdropSigIn input[type=submit]").val("loading...").addClass("disabled");
    var passed = true

    if($("#backdropSigIn #backdropSigInEmail").val() == "") {
        $("#backdropSigIn #backdropSigInEmail").css({"border":"solid thin #CC352D"});
        passed = false;
    }
    else { $("#backdropSigIn #backdropSigInEmail").css({"border":""}); }

    if($("#backdropSigIn #backdropSigInPassword").val() == "") {
        $("#backdropSigIn #backdropSigInPassword").css({"border":"solid thin #CC352D"});
        passed = false;
    }
    else { $("#backdropSigIn #backdropSigInPassword").css({"border":""}); }

    if(passed == true) {
        $.post("/php/user/login.php", { user_email: $("#backdropSigIn #backdropSigInEmail").val(),
                                               user_password:$("#backdropSigIn #backdropSigInPassword").val()
                                        },
            function(result){
                if(result == "User Login: Failed") {
                    $("#backdropInital .textError").text("Incorrect Email or Password").fadeIn();
                    $("#backdropSigIn input[type=submit]").val("Sign In").removeClass("disabled");
                }
                else {
                    var urlContinue = getUrlVars()['continue'];
                    if(urlContinue == null || urlContinue == "") { window.location.href = "/documents"; }
                    else { window.location.href = urlContinue; }
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
    var passed = true

    if($("#backdropRegister #backdropRegisterName").val() == "") {
        $("#backdropRegister #backdropRegisterName").css({"border":"solid thin #CC352D"});
        passed = false;
    }
    else { $("#backdropRegister #backdropRegisterName").css({"border":""}); }

    if($("#backdropRegister #backdropRegisterEmail").val() == "") {
        $("#backdropRegister #backdropRegisterEmail").css({"border":"solid thin #CC352D"});
        passed = false;
        finishRegister();
    }
    else {
         $.post("/php/user/email_check.php", { user_email: $("#backdropRegister #backdropRegisterEmail").val() },
            function(result){
                if(result == "1") {
                    $("#backdropRegister #backdropRegisterEmail").css({"border":""});
                    finishRegister();
                }
                else {
                    $("#backdropRegister #backdropRegisterEmail").css({"border":"solid thin #CC352D"});
                    $("#backdropInital .textError").text("Email Already Exists").fadeIn();
                    passed = false;
                    finishRegister();
                }

            }
        );
    }

    function finishRegister() {
        if($("#backdropRegister #backdropRegisterPassword").val() == "") {
            $("#backdropRegister #backdropRegisterPassword").css({"border":"solid thin #CC352D"});
            passed = false;
        }
        else { $("#backdropRegister #backdropRegisterPassword").css({"border":""}); }


        if($("#backdropRegister #backdropRegisterConfirm").val() == "") {
            $("#backdropRegister #backdropRegisterConfirm").css({"border":"solid thin #CC352D"});
            passed = false;
        }
        else {
            if($("#backdropRegister #backdropRegisterPassword").val() ==  $("#backdropRegister #backdropRegisterConfirm").val()) {
                $("#backdropRegister #backdropRegisterPassword").css({"border":""});
                $("#backdropRegister #backdropRegisterConfirm").css({"border":""});
            }
            else {
                $("#backdropRegister #backdropRegisterPassword").css({"border":"solid thin #CC352D"});
                $("#backdropRegister #backdropRegisterConfirm").css({"border":"solid thin #CC352D"});
                $("#backdropInital .textError").text("Passwords Do Not Match").fadeIn();
                passed = false;
            }
        }

        if(passed == true) {
            $.post("/php/user/register.php", { user_name: $("#backdropRegister #backdropRegisterName").val(),
                                                     user_email: $("#backdropRegister #backdropRegisterEmail").val(),
                                                     user_password: $("#backdropRegister #backdropRegisterPassword").val()
                                            },
                function(result){
                    if(result == 1) {
                        window.location.href = "/documents";
                    }
                    else {
                       $("#backdropInital .textError").text("User Registration Failed").fadeIn();
                       $("#backdropRegister input[type=submit]").val("Register").removeClass("disabled");
                    }

                }
            );
        } else {
            $("#backdropRegister input[type=submit]").val("Register").removeClass("disabled");
        }
    }
});