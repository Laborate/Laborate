<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
getDependencies(["core", "header"]);
if($_GET['github'] == 2) {
    $_SESSION['github_redirect'] = "/documents";
    echo "<script type='text/javascript'>window.location.href = '".$_SESSION['github_auth_url']."'</script>";
}
?>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>My Account · code-laborate</title>
	<?php placeDependencies(); ?>
</head>

<body>
    <?php $title = "My Account"; include("includes/header.php"); ?>
    <a href="<?php echo $_SESSION['github_auth_url']; ?>">Github</a>
</body>
</html>