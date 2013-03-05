<div id="sidebar_share" class="sidebar_content_inner">
	<script type="text/javascript" src="/js/core/copy.js"></script>
	<script type="text/javascript">
		function initialize_share() {
    		$("#shareUrl").val(window.location.href);
            $("#shareCopy").zclip({
                path:'../flash/copy.swf',
                copy: window.location.href,
                afterCopy: function(){
                    $("#shareCopy").val("Copied");
                    setTimeout(function() {
                        $("#shareCopy").val("Copy Invite Url");
                    }, 5000)
                }
            });
        };

        $("#emailSend").live("click", function() {
            if($("#emailAddresses").val() != "") {
                $.post("/server/php/email/invite.php", {   session_id: getUrlVars()['i'],
                                                            session_name: $("#document_title").text(),
                                                            email_addresses: $("#emailAddresses").val(),
                                                            email_message: $("#emailMessage").val() },
        			                         function(result) {
            			                         if(result == "1") {
            			                             $("#emailAddresses, #emailMessage").val("");
            			                             $("#emailSend").val("Email Sent");
            			                         }
            			                         else {
                			                         $("#emailSend").val("Email Failed").addClass("red_harsh");
            			                         }
                			                 });
            } else {
                $("#sidebar_share .header").eq(0).css("color", "#F10F00");
                $("#sidebar_share .header").eq(1).css("color", "#F10F00");
                $("#emailAddresses").css("border", "solid 1px #F10F00");
                $("#emailSend").val("Missing Information").addClass("red_harsh");
            }
            setTimeout(function() {
                $("#sidebar_share .header").eq(0).css("color", "");
                $("#sidebar_share .header").eq(1).css("color", "");
                $("#emailAddresses").css("border", "");
                $("#emailSend").val("Send Email").removeClass("red_harsh");
            }, 5000);
        });
    </script>
    <div>
       <div class="header">Email Address(s)</div>
       <div class="header" style="color: #666; font-size: 12px;">Comma Delimiter</div>
       <div><textarea id="emailAddresses" rows="1" style="height:40px;" class="input textarea" placeholder="john@doe.com, doe@jon.com"></textarea></div>
    </div>
    <div>
       <div class="header">Additional Message</div>
       <div><textarea id="emailMessage" spellcheck="false" class="input textarea" placeholder="Welcome to the team!"></textarea></div>
    </div>
    <input type="button" value="Send Email" id="emailSend" class="button green full"/>
    <hr/>
    <input type="button" value="Copy Invite Url" id="shareCopy" class="button blue full"/>
</div>