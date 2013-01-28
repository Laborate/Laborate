<?php
$GLOBALS['ajax_message'] = json_encode([0,0]);
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['session_id'])){
    $query_Sessions = "SELECT * FROM sessions WHERE sessions.session_id = '".$_POST['session_id']."'";
    $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
    $row_Sessions = mysql_fetch_assoc($Sessions);

    if($row_Sessions['session_id'] == $_POST['session_id']) {
        if(isset($_POST['session_password']) && $_SESSION['userLevel'] > 0) {
            if($row_Sessions['session_password'] == $_POST['session_password']) {
                $response = json_encode([1,0]);
            }
            else {
               $response = json_encode([1,1]);
            }
            $password = $_POST['session_password'];
        }
        else {
            $response = json_encode([1,0]);
            $password = $row_Sessions['session_password'];
        }

        if($_POST['session_name'] == "") {
            $name = $row_Sessions['session_name'];
        }
        else {
            $name = $_POST['session_name'];
        }

        $updateSQL = sprintf("UPDATE sessions SET session_name=%s, session_password=%s WHERE session_id=%s",
    				   GetSQLValueString($name, "text"),
    				   GetSQLValueString($password, "text"),
    				   GetSQLValueString($_POST['session_id'], "int"));
         $Sessions = mysql_query($updateSQL , $database) or die(mysql_error());
         echo $response;
    }
    else {
        echo json_encode([1,0]);
    }
}
?>