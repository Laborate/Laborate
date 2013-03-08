<?php
$GLOBALS['ajax_message'] = "";
$GLOBALS['ajax_only'] = true;
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

$locations = jsonToArray($GLOBALS['row_Users']['user_locations']);
$locations_array = array();

foreach ($locations as $key => $value) {
    if($value["type"] == "github") { if(is_null($_SESSION['userGithub'])) { continue; } $icon = "icon-github"; }
    elseif($value["type"] == "sftp") { $icon = "icon-drawer"; }
    else { $icon = "icon-storage"; }
    array_push($locations_array, array("key" => $key, "icon" => $icon, "name" => $value["name"], "type" => $value["type"]));
}

echo json_encode($locations_array);
?>