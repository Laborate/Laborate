//////////////////////////////////////////////////
//          Course Specific Functions
/////////////////////////////////////////////////

//New File Form
$("#backdropNewFileForm").live("submit", function() {

    var passed = true

    if($("#backdropNewFileForm #backdropScreenName").val() == "") {
        $("#backdropNewFileForm #backdropScreenName").css({"border":"solid thin #CC352D"});
        passed = false;
    }
    else {
        $("#backdropNewFileForm #backdropScreenName").css({"border":"solid thin #999"});
    }

    if($("#backdropNewFileForm #backdropDocTitle").val() == "") {
        $("#backdropNewFileForm #backdropDocTitle").css({"border":"solid thin #CC352D"});
        passed = false;
    }
    else  {
        if($("#backdropNewFileForm #backdropDocTitle").val() == "CHANGELOG" || $("#backdropNewFileForm #backDropDocTitle").val() == "README"  ) {}
         else {
            if($("#backdropNewFileForm #backdropDocTitle").val().split(".")[1] == "" || $("#backdropNewFileForm #backdropDocTitle").val().split(".")[1] == null) {
                $("#backdropNewFileForm #backdropDocTitle").css({"border":"solid thin #CC352D"});
                $("#backdropNewFile .textError").fadeIn();
                passed = false
            } else {
                $("#backdropNewFileForm #backdropDocTitle").css({"border":"solid thin #999"});
                $("#backdropNewFile .textError").fadeOut();
            }
        }
    }

    if(passed == true) {
        $(".textError").fadeOut();
        $("#backdropDataInput").slideUp(500);
        $("#backdropLoaderImg").slideDown(500);
        setTimeout(function() {
            $.post("server/php/session/new.php", { session_name: $("#backdropNewFileForm #backdropDocTitle").val(),
                                                   session_document: JSON.stringify(window.editor.getValue().split('\n'))
                                            },
                function(result){
                    window.passTemplate = "";
                    $("title").text("Codelaborate - " + $("#backdropNewFileForm #backdropDocTitle").val());
                    history.replaceState({}, ("Codelaborate - " + $("#backdropNewFileForm #backdropDocTitle").val()),  "?i=" + result);
                    finishBackdrop($("#backdropNewFileForm #backdropDocTitle").val());
                }
            );
        }, 600);
    }

    return false;
});

//Existing File Form
$("#backdropExistingFileForm").live("submit", function() {
    var passed = true

    if($("#backdropExistingFileForm #backdropScreenName").val() == "") {
        $("#backdropExistingFileForm #backdropScreenName").css({"border":"solid thin #CC352D"});
        passed = false;
    }
    else {
        $("#backdropExistingFileForm #backdropScreenName").css({"border":""});
    }

    if($("#backdropPassword").is("[type=password]")) {
        if($("#backdropPassword").val() == "") {
            $("#backdropPassword").css({"border":"solid thin #CC352D"});
            passed = false;
        }
        else {
            $("#backdropPassword").css({"border":""});
            $(".textError").fadeOut(); }
    }

   if(passed == true) {
        $.post("server/php/session/password_check.php", { session_id: getUrlVars()['i'],
                                               session_password: $("#backdropPassword").val()
                                        },
            function(password_response){
                if(password_response != "Password Authentication: Failed") {
                    $(".textError").fadeOut();
                    $("#backdropDataInput").slideUp(500);
                    $("#backdropLoaderImg").slideDown(500);
                    setTimeout(function() {
                        $.post("server/php/session/download.php", { download_id: "" + password_response },
                            function(dowload_response){
                                if(dowload_response != "Download: Failed") {
                                    window.passTemplate = $("#backdropPassword").val();
                                    window.editor.setValue(dowload_response.substr(1, dowload_response.length - 2));
                                    setTimeout(function() {
                                        finishBackdrop($("#backdropExistingFileForm #backdropDocTitle").val());
                                    }, 500);
                                }
                                else {
                                    $(".textError").text("Download Failed").fadeIn();
                                }
                            }
                        );
                    }, 500);
                }
                else {
                    $("#backdropPassword").css({"border":"solid thin #CC352D"});
                    $(".textError").fadeIn();
                }
            }
        );
    }

    return false;
});

//////////////////////////////////////////////////
//             General Functions
//////////////////////////////////////////////////

//Prevent Form Redirect
$("form").live("submit", function() { return false; });

$(window).ready(function() {
    $("body div").not("#backdrop, #backdrop div").hide();
    $("body").show();

    //Auto center backdrop core
	$("#backdropCore").vAlign().hAlign();

	//Turn Off Spell Check
    $("#backdrop input[type=text]").attr({"spellcheck": false});

    //Set Screen Name from cookie
    $("#backdropScreenName").val($.cookie("screenName"));
});

function finishBackdrop(title) {
    window.nodeSocket.emit('join', getUrlVars()['i']);
    window.activated = true;
    setTimeout(function(){
    	$.cookie("screenName", $("#backdropScreenName").val());
        setTitle(title);
        window.chatRoom._signIn();
        $("#backdrop, #backdrop div").hide();
        $("body div").not("#backdrop, #backdrop div, #contributor_info").show();
        $("#header #logo").hAlign().vAlign();
        window.editor.clearHistory();
        setTimeout(function(){ window.editor.refresh(); }, 1000);
    }, 100);
}
