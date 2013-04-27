<?php
$GLOBALS['ajax_message'] = "";
$GLOBALS['ajax_only'] = true;
require_once($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/locations/sftp_core.php');

if(isset($_POST['alias_id']) && isset($_POST['session_document'])) {
   $row_Sessions = session_alias($_POST['alias_id']);

    if($row_Sessions) {
        $locations = jsonToArray($GLOBALS['row_Users']['user_locations']);
        echo pushFile($locations[$row_Sessions['session_location_id']], $row_Sessions['session_external_path'], $_POST['session_document']);
    }
}
?>