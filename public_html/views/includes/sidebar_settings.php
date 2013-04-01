<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');
if($GLOBALS['row_Sessions_id']['session_owner'] == $_SESSION['user']) {
    $action = "Delete";
} else {
    $action = "Forget";
}
?>
<div id="sidebar_settings" class="sidebar_content_inner">
	<script type="text/javascript">
		function initialize_settings() {
    		$("#documentPassword").val(window.passTemplate);
			$("#documentTitle").val($("#document_title").text());
			$("#screenName").val($.cookie("screenName"));
			$("#keyMap_" + $.cookie("keyMap")).attr("selected", "selected");
			window.sidebarUtil.keyMap($.cookie("keyMap"));
		}

		$("#actionDoc").on("click", function() { $("#actionConfirm").slideDown(); });
		$("#actionConfirmCancel").on("click", function() { $("#actionConfirm").slideUp(); });

		$("#actionConfirmClick").on("click", function() {
    		var returnUrl = "http://<?php echo $_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]; ?>";

    		$.post("/php/session/actions.php", { session_id: getUrlVars()['i'],
    			                                       session_name: $("#documentTitle").val(),
    			                                       session_password: $("#documentPassword").val()
    			                                     },
    			                         function(result) {
        			                         if(result == "1") {
        			                             <?php if($action == "Delete") { ?>
        			                                 window.nodeSocket.emit( 'editor' , {"from": window.userId, "extras": {"passChange": "true"}} );
        			                             <?php } ?>
        			                             setTimeout(function() {
            			                             window.nodeSocket.emit( 'chatRoom' , {"from":window.userId, "isLeave":true} );
            			                             window.location.href = "/documents/";
        			                             }, 100);
        			                         }
        			                         else {
            			                         $("#actionDoc").val("<?php echo $action; ?> Failed").addClass("red_harsh");
        			                         }

        			                         setTimeout(function() {
            			                         $("#actionDoc").val("<?php echo $action; ?> Document").removeClass("red_harsh");
            			                     }, 5000);
            			                 });
            });



		$("#settingsSave").on("click", function() {
		    if($("#documentTitle").val() != "") {
        		if(window.screenName != $("#screenName").val() && $("#screenName").val() != "") {
        			window.chatRoom.screenNameChange(window.screenName, $("#screenName").val());
    			}
    			else {
        			$("#screenName").val($.cookie("screenName"));
    			}

    			window.sidebarUtil.keyMap($("#keyMap").val());
    			window.sidebarUtil.setTitle($("#documentTitle").val(), true);
                <?php if(in_array($_GET['i'], $_SESSION['file_owner'])) { ?>
    			    $("#backdropPassword").val($("#documentPassword").val());
    			    window.passTemplate = $("#documentPassword").val();
    			<? } ?>
    			$.post("/php/session/update.php", { session_id: getUrlVars()['i'],
    			                                           session_name: $("#documentTitle").val(),
    			                                           <?php if($action == "Delete" && !is_null($GLOBALS['row_Users']['user_pricing'])) { ?>
                                                           session_password: $("#documentPassword").val()
                                                           <? } ?>
                                        },
                    function(result){
                        jsonResult = JSON.parse(result);
                        if(jsonResult[0] == 1) {
                            <?php if(in_array($_GET['i'], $_SESSION['file_owner'])) { ?>
                            if(jsonResult[1] == 1) {
                              window.nodeSocket.emit( 'editor' , {"from": window.userId, "extras": {"passChange": "true"}} );
                            }
                            <? } ?>
                            $("#settingsSave").val("Saved").removeClass("red_harsh");
                        }
                        else {
                            $("#settingsSave").val("Save Failed").addClass("red_harsh");
                        }

                        setTimeout(function() {
                        		$("#settingsSave").val("Save Settings").removeClass("red_harsh");
                        }, 5000);
                    }
                );
            } else {
                $("#settingsSave").val("Missing Information").addClass("red_harsh");
                $("#sidebar_settings .header").eq(1).css("color", "#F10F00");
                $("#documentTitle").css("border", "solid 1px #F10F00");

                setTimeout(function() {
                		$("#settingsSave").val("Save Settings").removeClass("red_harsh");
                		$("#sidebar_settings .header").eq(1).css("color", "");
                		$("#documentTitle").css("border", "");
                }, 5000);
            }
		});

		$("#drawer_settings input").on("focus change", function() {
			$("#settingsSave").val("Save Settings");
		});
    </script>
    <div>
        <div class="header">Screen Name</div>
        <div><input id="screenName" type="text" placeholder="John Doe" spellcheck="false" class="input"/></div>
    </div>
    <hr/>
    <div>
        <div class="header">Document Title</div>
        <div><input id="documentTitle" type="text" placeholder="test.html" spellcheck="false" class="input"/></div>
    </div>
    <hr/>
    <?php if($action == "Delete" && !is_null($GLOBALS['row_Users']['user_pricing'])) { ?>
    <div>
       <div class="header">Document Password</div>
       <div><input id="documentPassword" type="password" placeholder="leave blank for no password" spellcheck="false" class="input"/></div>
    </div>
    <hr/>
    <?php } ?>
    <div>
    <div class="header">Key Mapping</div>
    <div>
        <select id="keyMap" class="select full">
            <option id="keyMap_default" value="default">None</option>
            <option id="keyMap_vim" value="vim">Vim</option>
            <option id="keyMap_emacs" value="emacs">Emacs</option>
        </select>
    </div>
    <hr/>
    <input type="button" id="settingsSave" value="Save Settings" class="button green full"/>
    <hr/>
    <input type="button" id="actionDoc" value="<?php echo $action; ?> Document" class="button red full"/>
    <div id="actionConfirm"><span class="a" id="actionConfirmClick">Yes</span> I am sure. <span class="a" id="actionConfirmCancel">Cancel</span></div>
</div>