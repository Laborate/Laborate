<?php
$GLOBALS['ajax_message'] = "";
$GLOBALS['ajax_only'] = true;
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/locations/github_core.php');

if(isset($_POST['location_id'])) {
    $locations = jsonToarray($GLOBALS['row_Users']['user_locations']);
    if(array_key_exists($_POST['location_id'], $locations)) {
        if(array_key_exists('github_repository', $locations[$_POST['location_id']])) {
            echo getDirectory($locations[$_POST['location_id']]['github_repository'], $_POST['dir']);
        } else {
            echo "Not Github Location";
        }
    } else {
        echo "Bad Location";
    }
}
?>