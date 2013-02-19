<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
setcookie('userLogin', null, time()-2419200, "/");
$_SESSION = array();
session_destroy();
if(isset($_GET["continue"])) {
    header("Location: /login?continue=".$_GET["continue"]);
}
else {
    header("Location: /");
}
?>