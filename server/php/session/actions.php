<?php
$GLOBALS['ajax_message'] = "0";
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['session_id'])) {
    $query_Sessions = "SELECT * FROM sessions WHERE sessions.session_id = '".$_POST['session_id']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);

    if($row_Sessions['session_owner'] == $_SESSION['userId']) {
    	$Delete = "DELETE FROM sessions WHERE session_id='".$_POST['session_id']."'";
    	mysql_select_db($database_database, $database);
    	$delete_results = mysql_query($Delete, $database) or die(mysql_error());
    	echo "1";
    }
    else {
        if(in_array($_SESSION['userId'], json_decode($row_Sessions['session_editors']))) {
            $editors = json_decode($row_Sessions['session_editors']);
            if($editors == null || $editors[0] == "") { $editors = array(); }
            if(in_array($_SESSION['userId'], $editors)) {
                unset($editors[key($editors)]);
            }
            $editors = json_encode($editors);
            $updateSQL = sprintf("UPDATE sessions SET session_editors=%s WHERE session_id=%s",
    				   GetSQLValueString($editors, "text"),
    				   $row_Sessions['session_id']);
            $UpdateSessions = mysql_query($updateSQL , $database) or die(mysql_error());
            echo "1";
        }
        else {
            echo $GLOBALS['ajax_message'];
        }
    }
}