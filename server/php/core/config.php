<?php
/* Configuration */
if($_SERVER['REMOTE_ADDR'] != "127.0.0.1") {
    error_reporting(E_ERROR | E_PARSE);
    //error_reporting(E_ALL);
    ini_set("display_errors", 1);
}

if (!isset($_SESSION)) { session_start(); }

if (!isset($_SESSION['CREATED'])) {
    $_SESSION['CREATED'] = time();
} else if (time() - $_SESSION['CREATED'] > 1800) {
    session_regenerate_id(true);
    $_SESSION['CREATED'] = time();
}

if (!isset($_SESSION['initiated'])) {
    session_regenerate_id();
    $_SESSION['initiated'] = true;
}

if(isset($_SESSION['user'])) {
    if(!isset($_SESSION['file_owner'])) {
        $_SESSION['file_owner'] = array();
    }
}

//Development vs. Production Config
if($_SERVER['REMOTE_ADDR'] == "127.0.0.1") {
    $_SESSION['no_cache'] = true;
}
else {
    $_SESSION['no_cache'] = false;
}


/* Globals Settings */
//Website Title
$_SESSION['webSiteTitle'] = " · Code-Laborate";

//Crypt Salt
$_SESSION['cryptSalt'] = 'ajl!k3?242!@#f342$%6456^&*()_`\`a;k:sfj#/?a-]s{df}|';

//Github Authentication
$_SESSION['github_id'] = "310d8a45f13df3dfbf95";
$_SESSION['github_secret'] = "0be78393c4533047b1e1e230cd3f8039e82879d5";
$_SESSION['github_scope'] = "repo";
$_SESSION['github_state'] = crypt($_SESSION['user'], $_SESSION['cryptSalt']);
$_SESSION['github_auth_url'] = "https://github.com/login/oauth/authorize?client_id=";
$_SESSION['github_auth_url'] .= $_SESSION['github_id']."&scope=".$_SESSION['github_scope']."&state=".$_SESSION['github_state'];

//Email Authentication
$_SESSION['email_authentication'] = true;
$_SESSION['email_authentication_method'] = "tls";
$_SESSION['email_host'] = "smtp.gmail.com";
$_SESSION['email_port'] = 587;
$_SESSION['email_username'] = "support@laborate.io";
$_SESSION['email_password'] = "vallelunga";
?>