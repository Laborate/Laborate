<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_GET['i'])) {
    if($_GET['i'] == "" || $_GET['i'] == null) {
        echo "<script type='text/javascript'>window.location.href = '/editor'</script>";
    }
    else {
        $query_Sessions = "SELECT * FROM sessions WHERE sessions.session_id = '".$_GET['i']."'";
        $Sessions = mysql_query($query_Sessions , $database) or die(mysql_error());
        $row_Sessions = mysql_fetch_assoc($Sessions);
        $totalRows_Sessions = mysql_num_rows($Sessions);

        if($row_Sessions['session_id'] == $_GET['i']) {
            if(is_null($row_Sessions['session_password'])) { $passwordRequired = false; }
            else { $passwordRequired = true; }
            $initalize = array($passwordRequired, $row_Sessions['session_name'], $row_Sessions['session_type']);

            if($row_Sessions['session_owner'] == $_SESSION['userId']) {
                if(!in_array($_GET['i'], $_SESSION['file_owner'])) {
                    array_push($_SESSION['file_owner'], $_GET['i']);
                }
            }
        }
        else {
            echo "<script type='text/javascript'>window.location.href = '/editor'</script>";
        }
    }
}
?>