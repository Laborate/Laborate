<?php
//Requires & Config
require_once($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/session/initialize.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
$GLOBALS['backdropMode'] = "editor";
getDependencies(["core", "icons", "editor", "chatroom", "header", "backdrop"]);
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <?php if(isset($_GET['i'])) { ?>
        <title><?php echo $initalize[1].$_SESSION['webSiteTitle']; ?></title>
    <?php } else { ?>
        <title>Editor<?php echo $_SESSION['webSiteTitle']; ?></title>
    <?php } ?>
    <script src="http://<?php echo $_SERVER['SERVER_ADDR']; ?>:8000/socket.io/socket.io.js"></script>
  	<script type="text/javascript">
  	    try {
  	        window.nodeSocket = io.connect('http://<?php echo $_SERVER['SERVER_ADDR']; ?>:8000');
  	    } catch(err) { window.location.href = "/errors/node.php" }
  	 </script>
  	 <?php placeDependencies(); ?>
</head>
<body style="display:none;">
    <?php include("includes/header.php"); ?>
    <div id="sidebar">
        <div id="sidebar_header">
            <img id="document" onClick="sidebar('document')" src="/img/document.png"/>
            <img id="find" onClick="sidebar('find')" src="/img/find.png"/>
            <img id="share" onClick="sidebar('share')" src="/img/share.png"/>
            <img id="download" onClick="sidebar('download')" src="/img/download.png"/>
            <img id="settings" onClick="sidebar('settings')" src="/img/settings.png"/>
        </div>
        <div id="sidebar_content"></div>
    </div>
    <div id="editorCodeMirror">
        <div id="full_screen" class="icon-expand right"></div>
        <textarea id="code" name="code" runnable="true" style="display:none"></textarea>
    </div>
    <?php include("includes/chat_room.php"); ?>
    <?php include("includes/backdrop.php"); ?>
</body>
</html>