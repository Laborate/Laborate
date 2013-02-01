<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
getDependencies(["core", "header"]);
?>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>My Account · Code-Laborate</title>
	<?php placeDependencies(); ?>
</head>

<body>
    <?php $title = "My Account"; include("includes/header.php"); ?>
    <a href="https://github.com/login/oauth/authorize?client_id=<?php echo $_SESSION['github_id']; ?>&scope=<?php echo $_SESSION['github_scope']; ?>&state=<?php echo $_SESSION['userId']; ?>">Github</a>
</body>
</html>