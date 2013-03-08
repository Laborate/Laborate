<?php
//Requires & Config
require_once($_SERVER['DOCUMENT_ROOT'].'/php/user/redirect.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
$GLOBALS['backdropMode'] = 'login';
getDependencies(['backdrop', 'core']);
?>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
    <title>Login<?php echo $_SESSION['webSiteTitle']; ?></title>
    <?php placeDependencies(); ?>
</head>
<body>
    <?php include('includes/backdrop.php'); ?>
</body>
</html>