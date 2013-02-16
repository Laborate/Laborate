<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/template/dependencies.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/includes/signature.php');
getDependencies(["core", "header", "account", "icons"]);
if($_GET['github'] > 1) {
    if($_GET['github'] == 2) {
        $_SESSION['github_redirect'] = "/documents";
    }

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
        <?php if($_SESSION['userLevel'] > 0 && $_SESSION['userLevel'] < 3) { ?>
        <div id="navigation_password_file">
            <div id="navigation_password_header" class="left">PRIVATE DOCUMENTS</div>
            <div id="navigation_password_header_light" class="right">2 of 5,000</div>
            <div class="clear"></div>
        </div>
        <?php } ?>
        <ul>
            <li id="profile">Public Profile</li>
            <li id="account">Account Settings</li>
            <li id="github">Github Locations</li>
            <li id="sftp">SFTP Locations</li>
            <li id="billing">Billing Options</li>
            <li id="payments">Payment History</li>
        </ul>
    </div>
    <div id="setting_pane">
        <div class="notification"></div>
        <div id="settings_github" class="settings">
            <div class="settings_header">
                <div class="left">Github Repositories</div>
                <?php if(is_null($_SESSION['userGithub'])) { ?>
                    <a class="button green right" href="<?php echo $_SESSION['github_auth_url']; ?>">Authorize With Github</a>
                <?php } else { ?>
                    <a class="button red right" href="/server/php/locations/github_remove_token.php">Deauthorize With Github</a>
                <?php } ?>
                <div class="clear"></div>
            </div>
            <div class="settings_content">
                <ul class="table"></ul>
                <div id="need_github_login" class="hidden">
                    <div class="icon_big icon-github"></div>
                    <div class="bold">You Need To Be Authorized<br>With Github To View You Repositories</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>