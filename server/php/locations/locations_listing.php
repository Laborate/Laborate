<?php
$GLOBALS['ajax_message'] = "";
$GLOBALS['ajax_only'] = true;
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

$locations = jsonToarray($GLOBALS['row_Users']['user_locations']);
$locations_array = array();

foreach ($locations as $key => $value) {
    if($value["type"] == "github") { $icon = "icon-github"; }
    elseif($value["type"] == "sftp") { $icon = "icon-drawer-2"; }
    else { $icon = "icon-storage"; }
    array_push($locations_array, array("key" => $key, "icon" => $icon, "name" => $value["name"]));
}

echo json_encode($locations_array);
?>