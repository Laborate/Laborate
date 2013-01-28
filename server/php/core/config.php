<?php

if (!isset($_SESSION)) { session_start(); }

if (!isset($_SESSION['CREATED'])) {
    $_SESSION['CREATED'] = time();
} else if (time() - $_SESSION['CREATED'] > 1800) {
    session_regenerate_id(true);
    $_SESSION['CREATED'] = time();
}

if (!isset($_SESSION['initiated'])) {
    session_regenerate_id();
    $_SESSION['initiated'] = true;
}

if(isset($_SESSION['userId'])) {
    if(!isset($_SESSION['file_owner'])) {
        $_SESSION['file_owner'] = array();
    }
}

if($_SERVER['REMOTE_ADDR'] == "127.00.00.1") { //Production
    ini_set("display_errors", 0);
    $_SESSION['cache'] = false;
}
else { //Local
    ini_set("display_errors", 1);
    $_SESSION['cache'] = true;
}
?>