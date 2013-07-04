$(window).ready(function() {
    /* Core Operations */
    $("#sidebar_header img").live("click", function() {
        window.sidebarUtil.change($(this).attr("id"), "");
    });

    $("#sidebar #sidebar_header img").live("click mousedown", function() {
        return false;
    });

    $("#sidebar form").live("submit", function() {
        return false;
    });

    /* Triggers: Documents */
    $("#document_undo").live("click", function() {
        window.editor.undo();
    });

    $("#document_redo").live("click", function() {
        window.editor.redo();
    });

    $("#document_format").live("click", window.sidebarUtil.format);


    /* Triggers: Find */
    $("#lineNumberList .listX").live("click", function() {
        window.sidebarUtil.highlightRemove($(this).parent());
    });

    $("#findList .listX").live("click", function() {
        window.sidebarUtil.searchRemove($(this));
    });

    $("#lineNumberJumpForm").live("submit", function() {
        window.sidebarUtil.jumpToLine($("#lineNumberJump").val());
        $("#lineNumberJump").val("");
        return false;
    });

    $("#lineNumberForm").live("submit", function() {
         window.sidebarUtil.highlight($("#lineNumber").val());
         $("#lineNumber").val("");
         return false;
    });

    $("#findWordsForm").live("submit", function() {
        window.sidebarUtil.search($("#findWords").val());
        $("#findWords").val("");
        return false;
    });

    /* Triggers: Share */
    $("#email_share").live("submit", function() {
        if($("#emailAddresses").val() != "") {
            $("#emailSend").addClass("disabled").val("Sending...");
            $("#sidebar_share .header").eq(0).css("color", "");
            $("#emailAddresses").css("border", "");

            $.post("/editor/email/invite/", {
                document: url_params()["document"],
                addresses: $("#emailAddresses").val(),
                message: $("#emailMessage").val(),
                _csrf: $("#_csrf").text()
            }, function(json) {
                 if(json.success) {
                     $("#emailAddresses, #emailMessage").val("");
                     $("#emailSend").removeClass("disabled").val("Email Sent");
                 }
                 else {
                     $("#emailSend").removeClass("disabled").val("Email Failed").addClass("red_harsh");
                 }

                 setTimeout(function() {
                    $("#emailSend").val("Send Email").removeClass("red_harsh");
                 }, 5000);
             });
        } else {
            $("#sidebar_share .header").eq(0).css("color", "#F10F00");
            $("#emailAddresses").css("border", "solid 1px #F10F00");
            $("#emailSend").val("Missing Information").addClass("red_harsh");
            setTimeout(function() {
                $("#sidebar_share .header").eq(0).css("color", "");
                $("#emailAddresses").css("border", "");
                $("#emailSend").val("Send Email").removeClass("red_harsh");
            }, 5000);
        }
    });

    /* Triggers: Download */
    $("#downloadFile").live("click", window.sidebarUtil.downloadFile);
    $("#printButton").live("click", window.sidebarUtil.printFile);
    $("#githubCommit").live("click", window.sidebarUtil.commitFile);
    $("#saveToServer").live("click", window.sidebarUtil.pushFile);
});
