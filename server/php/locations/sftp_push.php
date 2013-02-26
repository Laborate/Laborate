<?php
$GLOBALS['ajax_message'] = "";
$GLOBALS['ajax_only'] = true;
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/locations/sftp_core.php');

if(isset($_POST['commit_id']) && isset($_POST['session_document'])) {
   $query_Sessions = "SELECT * FROM download, sessions WHERE sessions.session_id = download.session_id AND download.download_id = '".$_POST['commit_id']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);

    $deleteSQL = sprintf("DELETE FROM download WHERE download.download_id = '".$_POST['commit_id']."'");
    mysql_select_db($database_database, $database);
    $Result1 = mysql_query($deleteSQL, $database) or die(mysql_error());

    if($row_Sessions['download_id'] == $_POST['commit_id']) {
        $locations = jsonToArray($GLOBALS['row_Users']['user_locations']);
        echo pushFile($locations[$row_Sessions['session_location_id']], $row_Sessions['session_external_path'], $_POST['session_document']);
    }
}
?>