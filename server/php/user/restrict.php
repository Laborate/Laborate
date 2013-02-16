<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(!function_exists('redirect')) {
    function redirect($logout) {
        if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' ) {
            echo $GLOBALS['ajax_message'];
        } else {
            if($GLOBALS['ajax_only']) {
                header('HTTP/1.0 404 Not Found');
                include($_SERVER['DOCUMENT_ROOT'].'/errors/notfound.php');
                exit();
            } else {
                if($logout) {
                    header("Location: /server/php/user/logout?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                }
                else {
                    header("Location: /login?continue=http://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
                }
            }
        }
    }
}

if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' && $GLOBALS['ajax_only']) {
    redirect();
}
else {
    if(isset($_SESSION['userId'])) {
        if($GLOBALS['row_Users']['user_id'] != $_SESSION['userId']) {
            redirect(true);
        }
    } else { redirect(false); }
}
?>