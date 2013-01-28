<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
$_SESSION = array();
session_destroy();
header("Location: /");
?>