<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/cookie_check.php');
if(isset($_SESSION['userId'])) {
    header("Location: /documents");
} else {
    if(cookieCheck() == true) {
        header("Location: /documents");
    }
}
?>