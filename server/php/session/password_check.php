<?php
$GLOBALS['ajax_message'] = "Password Authentication: Failed";
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['session_id'])) {
    $query_Sessions = "SELECT * FROM sessions WHERE sessions.session_id = '".$_POST['session_id']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);
    $totalRows_Sessions = mysql_num_rows($Sessions);

    if($row_Sessions['session_id'] == $_POST['session_id']) {

        if($_POST['session_password'] == "") { $pass = NULL; }
        else { $pass = crypt($_POST['session_password'], $_SESSION['cryptSalt']); }

        if($row_Sessions['session_password'] == $pass ) {
            function createId() {
                require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
                $continue = true;
                while($continue == true) {
                    $id = rand(101, 999999999999999999) - rand(1, 100);
                    $query_Sessions = "SELECT * FROM download WHERE download.download_id = '".$id."'";
                    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
                    $row_Sessions = mysql_fetch_assoc($Sessions);
                    if(is_null($row_Sessions['download_id'])) {$continue = false; }
                }
               return $id;
            }

            $id = createId();
            $insertSQL = sprintf("INSERT INTO download (download_id, session_id) VALUES (%s, %s)", $id, $_POST['session_id']);
            $Sessions = mysql_query($insertSQL , $database) or die(mysql_error());
            echo $id;

        } else { echo $GLOBALS['ajax_message']; }
    } else { echo $GLOBALS['ajax_message']; }
} else { echo $GLOBALS['ajax_message']; }
?>