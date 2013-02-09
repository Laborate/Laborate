<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
getDependencies(["core", "header", "account", "icons"]);
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
    <div id="navigation">
        <div id="navigation_header"><?php echo $_SESSION['userName']; ?></div>
        <ul>
            <li id="nav_online">Public Profile</li>
            <li id="nav_account_settings">Account Settings</li>
            <li id="nav_github_locations" class="selected">Github Locations</li>
            <li id="nav_sftp_locations">SFTP Locations</li>
            <li id="nav_billing">Billing Options</li>
            <li id="nav_payment_history">Payment History</li>
        </ul>
    </div>
    <div id="setting_pane">
        <div class="settings">
            <div class="settings_header">
                <div class="left">Github Locations</div>
                <?php if(is_null($_SESSION['userGithub'])) { ?>
                    <a class="button green right" href="<?php echo $_SESSION['github_auth_url']; ?>">Authorize With Github</a>
                <?php } else { ?>
                    <a class="button red right" href="/server/php/locations/github_remove_token.php">Deauthorize With Github</a>
                <?php } ?>
                <div class="clear"></div>
            </div>
            <div class="settings_content">
            </div>
        </div>
    </div>
</body>
</html>