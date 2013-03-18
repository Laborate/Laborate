<?php
//Requires & Config
require_once($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/session/initialize.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
$GLOBALS['backdropMode'] = "editor";
getDependencies(["core", "icons", "editor", "chatroom", "header", "backdrop"]);

if(isset($_GET['i'])) {
    $title = $initalize[1];
} else {
    $title = "Editor";
}
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <?php include($_SERVER['DOCUMENT_ROOT']."/includes/meta_tags.php"); ?>
    <script src="http://<?php echo $_SERVER["HTTP_HOST"]; ?>:8000/socket.io/socket.io.js"></script>
  	<script type="text/javascript">
  	    try {
  	        window.nodeSocket = io.connect('http://<?php echo $_SERVER["HTTP_HOST"]; ?>:8000');
  	    } catch(err) { window.location.href = "/errors/node.php" }
  	 </script>
  	 <?php placeDependencies(); ?>
</head>
<body style="display:none;">
    <?php include($_SERVER['DOCUMENT_ROOT']."/includes/header.php"); ?>
    <div id="sidebar">
        <div id="sidebar_header">
            <img id="document" onClick="sidebar('document')" src="http://resources.code.dev.laborate.io/img/document.png"/>
            <img id="find" onClick="sidebar('find')" src="http://resources.code.dev.laborate.io/img/find.png"/>
            <img id="share" onClick="sidebar('share')" src="http://resources.code.dev.laborate.io/img/share.png"/>
            <img id="download" onClick="sidebar('download')" src="http://resources.code.dev.laborate.io/img/download.png"/>
            <img id="settings" onClick="sidebar('settings')" src="http://resources.code.dev.laborate.io/img/settings.png"/>
        </div>
        <div id="sidebar_content"></div>
    </div>
    <div id="editorCodeMirror">
        <div id="full_screen" class="icon-expand right"></div>
        <textarea id="code" name="code" runnable="true" style="display:none"></textarea>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT']."/includes/chat_room.php"); ?>
    <?php include($_SERVER['DOCUMENT_ROOT']."/includes/backdrop.php"); ?>
</body>
</html>