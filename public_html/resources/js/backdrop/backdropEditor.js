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
            $.post("/php/session/new.php", { session_name: $("#backdropNewFileForm #backdropDocTitle").val(),
                                             session_document: JSON.stringify(window.editor.getValue().split('\n'))
                                            },
                function(result){
                    window.passTemplate = "";
                    history.replaceState({}, null,  "?i=" + result);
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
        $.post("/php/session/password_check.php", { session_id: getUrlVars()['i'],
                                               session_password: $("#backdropPassword").val()
                                        },
            function(password_response){
                if(password_response != "Password Authentication: Failed") {
                    $(".textError").fadeOut();
                    $("#backdropDataInput").slideUp(500);
                    $("#backdropLoaderImg").slideDown(500);
                    setTimeout(function() {
                        $.post("/php/session/download.php", { download_id: "" + password_response },
                            function(dowload_response){
                                if(dowload_response != "Download: Failed") {
                                    window.passTemplate = $("#backdropPassword").val();
                                    proccessedDocuemt = "";
                                    var json = JSON.parse(dowload_response);

                                    $.each(JSON.parse(json[1]), function(i, item) {
                                        proccessedDocuemt += item;
                                        if(i+1 != json.length) {
                                            proccessedDocuemt += "\n";
                                        }
                                    });
                                    window.editor.setValue(proccessedDocuemt);
                                    $.each(JSON.parse(json[0]), function(i, item) {
                                        window.editorUtil.gutterClick("in", {"line":item, "remove": false});
                                    });
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

$(window).ready(function() {
    $("#backdropScreenName").val($.cookie("screenName"));
});

function finishBackdrop(title) {
    window.editorUtil.join($("#backdropScreenName").val(), $("#backdropPassword").val());
    setTimeout(function(){
        window.sidebarUtil.setTitle(title);
        $("#backdrop, #backdrop div").hide();
        $("body div").not("#backdrop, #backdrop div, #contributor_info, #actionConfirm, .notification").show();
        $("#header #logo").hAlign().vAlign();
        window.editor.clearHistory();
        setTimeout(function(){ window.editor.refresh(); }, 1000);
        sidebar($("#sidebar_header .default").attr("id"), "");
    }, 100);
}