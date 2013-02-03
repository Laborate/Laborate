<?php
$GLOBALS['ajax_message'] = "";
$GLOBALS['ajax_only'] = true;
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['session_id'])){
    $query_Sessions = "SELECT * FROM sessions WHERE sessions.session_id = '".$_POST['session_id']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);

    if($row_Sessions['session_id'] == $_POST['session_id'] || in_array($_SESSION['userId'], json_decode($row_Sessions['session_editors']))) {
        if($_POST['session_name'] == "") { $name = $row_Sessions['session_name']; }
        else { $name = $_POST['session_name']; }

        $updateSQL = sprintf("UPDATE sessions SET session_name=%s WHERE session_id=%s",
				   GetSQLValueString($name, "text"), $_POST['session_id']);
        $update = mysql_query($updateSQL , $database) or die(mysql_error());
    }
}

?>