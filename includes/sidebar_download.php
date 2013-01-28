<div id="sidebar_download" class="sidebar_content_inner">
    <script type="text/javascript">
        $("#downloadFile").live("click", function() {
            $.post("server/php/session_password_check.php", { session_id: getUrlVars()['i'], session_password: $("#backdropPassword").val() },
                function(password_response){
                    if(password_response != "Password Authentication: Failed") {
                        window.location.href = "server/php/session_download_file.php?i=" + password_response;
                        $("#downloadFile").removeClass("red_harsh");
                    }
                    else {
                       $("#downloadFile").addClass("red_harsh").val("Download Failed");
                       setTimeout(function() {
                    		$("#downloadFile").removeClass("red_harsh").val("Download File");
                		}, 5000);
                    }
                }
            );
        });

        $("#printButton").live("click", function() {
            var url = "print.php?i="+ getUrlVars()['i'] + "&p="+ window.passTemplate + "&t=" + $("#document_title").text();
            printWindow = window.open(url, 'title', 'width=800, height=500, menubar=no,location=no,resizable=no,scrollbars=no,status=no');
        });
    </script>
    <div>
        <div class="header">Github Login</div>
        <div><input id="githubUserName" type="text" placeholder="User Name" spellcheck="false" class="input"/></div>
        <div><input id="githubPassword" type="password" placeholder="Password" spellcheck="false" class="input"/></div>
    </div>
    <input type="button" id="githubLogin" value="Login" class="button green full"/>
    <hr/>
    <input type="button" value="Download Document" id="downloadFile" class="button blue full"/>
    <hr/>
    <input type="button" value="Print Document" id="printButton" class="button blue full"/>
</div>