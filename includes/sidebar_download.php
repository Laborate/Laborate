<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
?>
<div id="sidebar_download" class="sidebar_content_inner">
    <script type="text/javascript">
        $("#downloadFile").live("click", function() {
            $.post("server/php/session/password_check.php", { session_id: getUrlVars()['i'], session_password: $("#backdropPassword").val() },
                function(password_response){
                    if(password_response != "Password Authentication: Failed") {
                        window.location.href = "server/php/session/download_file.php?i=" + password_response;
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

        $("#githubCommit").live("click", function() {
            $.post("server/php/session/password_check.php", { session_id: getUrlVars()['i'], session_password: $("#backdropPassword").val() },
                function(password_response){
                    if(password_response != "Password Authentication: Failed") {
                        $("#githubCommit").removeClass("red_harsh").val("Commiting File...");
                        if($("#githubReference").val() != "") { var related = "\n\nRelated: #" + $("#githubReference").val(); }
                        else { var related = ""; }
                        $.post("server/php/locations/github_commit.php", {
                                                                commit_id: password_response,
                                                                session_document: window.editor.getValue(),
                                                                message: $("#githubMessage").val() + related
                                                },
                            function(result){
                                if(result == "Commit Succeeded") {
                                    $("#githubCommit").val("File Commited").removeClass("red_harsh");
                                }
                                else {
                                    $("#githubCommit").addClass("red_harsh").val("Commit Failed");
                                }
                            }
                        );
                    }
                    else {
                       $("#githubCommit").addClass("red_harsh").val("Commit Failed");
                    }

                    setTimeout(function() {
                		$("#githubCommit").removeClass("red_harsh").val("Commit File");
            		}, 5000);
                }
            );
        });

        $("#printButton").live("click", function() {
            var url = "print.php?i="+ getUrlVars()['i'] + "&p="+ window.passTemplate + "&t=" + $("#document_title").text();
            printWindow = window.open(url, 'title', 'width=800, height=500, menubar=no,location=no,resizable=no,scrollbars=no,status=no');
        });
    </script>
    <?php if($GLOBALS['row_Sessions_id']['session_type'] == "github") { ?>
        <div>
            <div class="header">Commit File</div>
            <div><input id="githubMessage" type="text" placeholder="Commit Message" spellcheck="false" class="input"/></div>
            <div>
                <div class="left" style="margin-top: 6px">Reference</div>
                <div class="left" style="color:#666; margin:6px 2px 0px 5px">#</div>
                <input id="githubReference" type="text" placeholder="22" spellcheck="false" style="width:99px" class="input left"/>
                <div class="clear"></div>
            </div>
        </div>
        <input type="button" id="githubCommit" value="Commit File" class="button green full"/>
        <hr/>
    <?php } elseif($GLOBALS['row_Sessions_id']['session_type'] == "sftp") { ?>
        <input type="button" value="Save To Server" id="saveToServer" class="button green full"/>
        <hr/>
    <?php }  ?>
    <input type="button" value="Download Document" id="downloadFile" class="button blue full"/>
    <hr/>
    <input type="button" value="Print Document" id="printButton" class="button blue full"/>
</div>