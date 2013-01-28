<?php

if($_SERVER['REMOTE_ADDR'] != "127.0.0.1") {
    error_reporting(E_ERROR | E_PARSE);
    ini_set("display_errors", 1);
}

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

if($_SERVER['REMOTE_ADDR'] == "127.0.0.1") {
    $_SESSION['cache'] = true;
}
else {
    $_SESSION['cache'] = false;
}
?>