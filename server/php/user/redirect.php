<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/user/cookie_check.php');
if(isset($_SESSION['user'])) {
    header("Location: /documents/");
} else {
    if(cookieCheck() == true) {
        header("Location: /documents/");
    }
}
?>