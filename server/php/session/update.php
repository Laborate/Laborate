<?php
$GLOBALS['ajax_message'] = json_encode([0,0]);
$GLOBALS['ajax_only'] = true;
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_POST['session_id'])){
    $query_Sessions = "SELECT * FROM sessions WHERE sessions.session_id = '".$_POST['session_id']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);

    if($row_Sessions['session_id'] == $_POST['session_id']) {
        if($row_Sessions['session_owner'] == $_SESSION['user'] || in_array($_SESSION['user'], json_decode($row_Sessions['session_editors']))) {
            if(isset($_POST['session_password']) && !is_null($GLOBALS['row_Users']['user_pricing']) && $row_Sessions['session_owner'] == $_SESSION['user'] ) {
                if($_POST['session_password'] == "") {
                    $password = NULL;
                } else {
                    $password = aesEncrypt($_POST['session_password'], $_SESSION['cryptSalt']);
                }

                if($row_Sessions['session_password'] == $password) {
                    $response = json_encode([1,0]);
                } else {
                   $response = json_encode([1,1]);
                }
            } else {
                $response = json_encode([1,0]);
                $password = $row_Sessions['session_password'];
            }

            if($_POST['session_name'] == "") {
                $name = $row_Sessions['session_name'];
                $path = $row_Sessions['session_external_path'];
            } else {
                $name = $_POST['session_name'];
                if(!is_null($row_Sessions['session_external_path'])) {
                    if(strrpos($row_Sessions['session_external_path'], "/") === false) {
                        $path = $_POST['session_name'];
                    } else {
                        $path = substr($row_Sessions['session_external_path'], 0, strrpos($row_Sessions['session_external_path'], "/"));
                        $path .= "/".$_POST['session_name'];
                    }
                } else {
                   $path = $row_Sessions['session_external_path'];
                }
            }

            $updateSQL = sprintf("UPDATE sessions SET session_name=%s, session_external_path=%s, session_password=%s WHERE session_id=%s",
        				   GetSQLValueString($name, "text"),
        				   GetSQLValueString($path, "text"),
        				   GetSQLValueString($password, "text"),
        				   GetSQLValueString($_POST['session_id'], "double"));
             $Sessions = mysql_query($updateSQL , $database) or die(mysql_error());
             echo $response;
        } else {
            echo $GLOBALS['ajax_message'];
        }
    } else {
        echo $GLOBALS['ajax_message'];
    }
}
?>