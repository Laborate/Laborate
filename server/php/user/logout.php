<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
setcookie('USRRC', null, time()-2419200, "/");
$_SESSION = array();
session_destroy();
if(isset($_GET["continue"])) {
    header("Location: /login/?continue=".$_GET["continue"]);
}
else {
    header("Location: /");
}
?>