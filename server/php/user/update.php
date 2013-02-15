<?php
$GLOBALS['ajax_message'] = "";
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['locations_add'])) {
    $locations = jsonToarray($GLOBALS['row_Users']['user_locations']);
    $locations[$_POST['locations_add'][0]] = $_POST['locations_add'][1];
    $query_Sessions = sprintf("UPDATE users SET user_locations=%s WHERE user_id=%s",
        GetSQLValueString(aesEncrypt(json_encode($locations), $_SESSION['cryptSalt']), "text"), $_SESSION['userId']);
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
}

if(isset($_POST['locations_remove'])) {
    $locations = jsonToarray($GLOBALS['row_Users']['user_locations']);
    unset($locations[$_POST['locations_remove']]);
    $query_Sessions = sprintf("UPDATE users SET user_locations=%s WHERE user_id=%s",
        GetSQLValueString(aesEncrypt(json_encode($locations), $_SESSION['cryptSalt']), "text"), $_SESSION['userId']);
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    echo $_POST['locations_remove'];
}
?>