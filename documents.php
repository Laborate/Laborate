<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
getDependencies(["core", "header", "documents", "icons"]);
global $getVars;
$getVars = $_GET;
require("server/php/template/documents.php");
?>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>My Documents · Code-Laborate</title>
	<?php placeDependencies(); ?>
</head>
<body>
    <?php $title = "My Documents"; include("includes/header.php"); ?>
    <div id="locations">
        <div id="locations_header">
            <div class="left">Locations</div>
            <input type="button" id="add_location" class="button location_button blue right" value="+" />
            <input type="button" id="remove_location" class="button location_button red right" value="-" />
            <input type="button" id="finished_remove_location" class="button location_button red hidden right" value="finished" />
            <div class="clear"></div>
        </div>
        <ul>
            <li id="online"><span class="icon icon-briefcase"></span>Online Files</li>
            <?php echoLocations(); ?>
        </ul>
    </div>
    <div id="files">
        <div id="location_online" class="location">
            <form class="file_search">
                <input type="text" class="input left search_input" autocomplete="off" name="s" placeholder="Search For Files"/>
                <select name="p" class="select left">
                    <option value="">Protection</option>
                    <option value="o" <?php if($_GET['p'] == "o") { echo "selected"; } ?>>Protection: Open</option>
                    <option value="p" <?php if($_GET['p'] == "p") { echo "selected"; } ?>>Protection: Password</option>
                    <option value="e" <?php if($_GET['p'] == "e") { echo "selected"; } ?>>Protection: Employee</option>
                </select>
                <select name="r" class="select left">
                    <option value="">Relation</option>
                    <option value="o" <?php if($_GET['r'] == "o") { echo "selected"; } ?>>Relation: Owner</option>
                    <option value="e" <?php if($_GET['r'] == "e") { echo "selected"; } ?>>Relation: Editor</option>
                                </select>
                <input type="submit" class="button blue left search_submit" value="Search" />
                <input type="button" class="button red left search_submit" id="clearSearch" value="Clear" />
                <a href="/editor" class="button green right" id="newFile">New File</a>
                <div class="clear"></div>
            </form>
            <div id="file_library"><?php echoDocuments(); ?></div>
            <div class="notFound">Sorry, no documents were found.</div>
        </div>
        <div id="location_template" class="location" data="">
            <form class="file_search">
                <input type="text" class="input left search_input_full" name="s" autocomplete="off" placeholder="Search For Files"/>
                <input type="submit" class="button blue left search_submit" value="Search" />
                <a href="/editor" class="button green right">New File</a>
                <div class="clear"></div>
            </form>
            <div id="location_template_loading">Loading</div>
            <div id="file_library"></div>
        </div>
    </div>
    <?php include("includes/mouseMenu.php"); ?>
    <?php include("includes/popUp.php"); ?>
</body>
</html>