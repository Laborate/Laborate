<?php
$GLOBALS['ajax_message'] = "Download: Failed";
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_POST['download_id'])) {
    $row_Sessions = session_alias($_POST['download_id']);

    if($row_Sessions) {
        if($row_Sessions['session_document'] == "") {
            $row_Sessions['session_document'] = json_encode([]);
        }

        $editors = json_decode($row_Sessions['session_editors']);
        if($editors == null || $editors[0] == "") {
            $editors = array();
        }

        if($row_Sessions['session_owner'] != $_SESSION['user'] && !in_array($_SESSION['user'], $editors)) {
            array_push($editors, $_SESSION['user']);
        }

        $updateSQL = sprintf("UPDATE sessions SET session_editors=%s WHERE session_id=%s",
				   GetSQLValueString(json_encode($editors), "text"), GetSQLValueString($row_Sessions['session_id'], "double"));
        $UpdateSessions = mysql_query($updateSQL , $database) or die(mysql_error());

        header('Set-Cookie: fileDownload=true; path=/');
        header('Cache-Control: max-age=60, must-revalidate');
        header("Content-type: application/octet-stream");
        header('Content-Disposition: attachment; filename="'.$row_Sessions['session_name'].'"');
        header("Cache-control: private");

        echo json_encode([$row_Sessions['session_breakpoints'], $row_Sessions['session_document']]);

    } else {
        echo $GLOBALS['ajax_message'];
    }
}
?>