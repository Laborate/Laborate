<?php
$GLOBALS['ajax_only'] = true;
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_POST['session_name']) && isset($_POST['session_document'])) {
    function createId() {
        require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
        $continue = true;
        while($continue == true) {
            $id = rand(101, 999999999999999999) - rand(1, 100);
            $query_Sessions = "SELECT * FROM sessions WHERE sessions.session_id = '".$id."'";
            $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
            $row_Sessions = mysql_fetch_assoc($Sessions);
            if(is_null($row_Sessions['session_id'])) {$continue = false; }
        }
       return $id;
    }

    $id = createId();
    if(!isset($_POST['session_type'])) { $type = null; } else { $type = $_POST['session_type']; }
    if(!isset($_POST['session_external_path'])) { $path = null; } else { $path = $_POST['session_external_path']; }

    $insertSQL = sprintf("INSERT INTO sessions (session_id, session_name, session_document,
                          session_owner, session_editors, session_breakpoints, session_type, session_external_path)
                          VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",

    				   $id,
    				   GetSQLValueString($_POST['session_name'], "text"),
    				   GetSQLValueString($_POST['session_document'], "text"),
    				   $_SESSION['userId'],
    				   GetSQLValueString(json_encode(array()), "text"),
    				   GetSQLValueString(json_encode(array()), "text"),
    				   GetSQLValueString($type, "text"),
    				   GetSQLValueString($path, "text"));

    $Sessions = mysql_query($insertSQL , $database) or die(mysql_error());
    array_push($_SESSION['file_owner'], $id);
    echo $id;
}
?>