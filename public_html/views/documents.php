<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
getDependencies(["core", "header", "documents", "icons"]);
$title = "My Documents";
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php include($_SERVER['DOCUMENT_ROOT']."/includes/meta_tags.php"); ?>
	<?php placeDependencies(); ?>
</head>
<body>
    <?php include($_SERVER['DOCUMENT_ROOT']."/includes/header.php"); ?>
    <div id="locations">
        <div id="locations_header">
            <div class="left">Locations</div>
            <button id="remove_location" class="location_button right">-</button>
            <button id="add_location" class="location_button right">+</button>
            <button id="finished_remove_location" class="location_button hidden right">finished</button>
            <div class="clear"></div>
        </div>
        <ul>
            <li id="online"><span class="icon icon-briefcase"></span>Online Files</li>
        </ul>
    </div>
    <div id="files">
        <div class="notification"></div>
        <div id="location_online" class="location">
            <form class="file_search">
                <input type="text" class="input left search_input" autocomplete="off" name="s" placeholder="Search For Files"/>
                <select name="p" class="select left">
                    <option value="">Protection</option>
                    <option value="o" <?php if($_GET['p'] == "o") { echo "selected"; } ?>>Protection: Open</option>
                    <option value="p" <?php if($_GET['p'] == "p") { echo "selected"; } ?>>Protection: Password</option>
                    <?php if($_SESSION['userLevel'] == 3) { ?>
                        <option value="e" <?php if($_GET['p'] == "e") { echo "selected"; } ?>>Protection: Employee</option>
                    <?php } ?>
                </select>
                <select name="r" class="select left">
                    <option value="">Relation</option>
                    <option value="o" <?php if($_GET['r'] == "o") { echo "selected"; } ?>>Relation: Owner</option>
                    <option value="e" <?php if($_GET['r'] == "e") { echo "selected"; } ?>>Relation: Editor</option>
                                </select>
                <input type="submit" class="button blue left search_submit" value="Search" />
                <input type="button" class="button red search_submit" id="clearSearch" value="Clear" />
                <a href="/editor/" class="button green right">New File</a>
                <div class="clear"></div>
            </form>
            <div id="file_library"></div>
            <div class="notFound">Sorry, no documents were found.</div>
        </div>
        <div id="location_template" class="location">
            <form class="file_search">
                <input type="text" class="input left search_input_full" name="s" autocomplete="off" placeholder="Search For Files"/>
                <input type="submit" class="button blue left search_submit" value="Search" />
                <input type="button" class="button red search_submit" id="clearSearch" value="Clear" />
                <button class="button green right newFile">New File</button>
                <div class="clear"></div>
            </form>
            <div id="file_library"></div>
        </div>
    </div>
    <?php include($_SERVER['DOCUMENT_ROOT']."/includes/mouseMenu.php"); ?>
    <?php include($_SERVER['DOCUMENT_ROOT']."/includes/popUp.php"); ?>
</body>
</html>