<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

$updateSQL = sprintf("UPDATE users SET user_github=%s WHERE user_id=%s",
    GetSQLValueString(NULL, "text"), $_SESSION['userId']);
$UpdateSessions = mysql_query($updateSQL , $database) or die(mysql_error());
$_SESSION['userGithub'] = null;
header("Location: /account.php");
?>