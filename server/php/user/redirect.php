<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
if(isset($_SESSION['userId'])) { header("Location: /documents");}
?>