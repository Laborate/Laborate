<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_GET['i'])) {
    if($_GET['i'] == "" || $_GET['i'] == null) {
        echo "<script type='text/javascript'>window.location.href = '/editor'</script>";
    }
    else {
        if($GLOBALS['row_Sessions_id']['session_id'] == $_GET['i']) {
            if(is_null($GLOBALS['row_Sessions_id']['session_password'])) { $passwordRequired = false; }
            else { $passwordRequired = true; }
            $initalize = array($passwordRequired, $GLOBALS['row_Sessions_id']['session_name']);

            if($GLOBALS['row_Sessions_id']['session_owner'] == $_SESSION['user']) {
                if(!in_array($_GET['i'], $_SESSION['file_owner'])) {
                    array_push($_SESSION['file_owner'], $_GET['i']);
                }
            }
        }
        else {
            header("Location: /editor");
        }
    }
}
?>