<?php
$GLOBALS['ajax_message'] = "";
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/locations/github_core.php');

if(isset($_POST['location_id']) && isset($_POST['file'])) {
    $locations = jsonToarray($GLOBALS['row_Users']['user_locations']);
    echo getFile($locations[$_POST['location_id']]['github_repository'], $_POST['file']);
}
?>