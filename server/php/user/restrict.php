<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/user/cookie_check.php');

if(!function_exists('redirect')) {
    function redirect($logout) {
        if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' ) {
            echo $GLOBALS['ajax_message'];
            exit();
        } else {
            if($GLOBALS['ajax_only']) {
                header('HTTP/1.0 404 Not Found');
                include($_SERVER['DOCUMENT_ROOT'].'/errors/notfound.php');
                exit();
            } else {
                if($logout) {
                    header("Location: /logout/?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                }
                else {
                    header("Location: /login/?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                }
            }
        }
    }
}

if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' && $GLOBALS['ajax_only']) {
    redirect(false);
} else {
    if(isset($_SESSION['userId'])) {
        if($GLOBALS['row_Users']['user_id'] != $_SESSION['userId']) {
            if(cookieCheck() != true) {
                redirect(true);
            }
        }
    } else {
        if(cookieCheck() != true) {
            redirect(false);
        }
    }
}
?>