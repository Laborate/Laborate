<?php
$GLOBALS['ajax_message'] = "Download: Failed";
$GLOBALS['ajax_only'] = true;
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_POST['download_id'])) {

    $query_Sessions = "SELECT * FROM download, sessions WHERE sessions.session_id = download.session_id AND download.download_id = '".$_POST['download_id']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);

    $deleteSQL = sprintf("DELETE FROM download WHERE download.download_id = '".$_POST['download_id']."'");
    mysql_select_db($database_database, $database);
    $Result1 = mysql_query($deleteSQL, $database) or die(mysql_error());

    if($row_Sessions['download_id'] == $_POST['download_id']) {
        $json = json_decode($row_Sessions['session_document']);

        if($json != null) {
            $editors = json_decode($row_Sessions['session_editors']);
            if($editors == null || $editors[0] == "") { $editors = array(); }
            if($row_Sessions['session_owner'] != $_SESSION['userId']) {
                if(!in_array($_SESSION['userId'], $editors)) {
                    array_push($editors, $_SESSION['userId']);
                }
            }

            $editors = json_encode($editors);
            $updateSQL = sprintf("UPDATE sessions SET session_editors=%s WHERE session_id=%s",
    				   GetSQLValueString($editors, "text"),
    				   $row_Sessions['session_id']);
            $UpdateSessions = mysql_query($updateSQL , $database) or die(mysql_error());

            echo $row_Sessions['session_document'];
        } else { echo $GLOBALS['ajax_message']; }

    } else { echo $GLOBALS['ajax_message']; }
}
?>