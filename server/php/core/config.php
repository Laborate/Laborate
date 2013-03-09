<?php

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

if(isset($_SESSION['userId'])) {
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

//Website Title
$_SESSION['webSiteTitle'] = " · Code-Laborate";

//Crypt Salt
$_SESSION['cryptSalt'] = '$2a$07$aydsaqvpodfwrtdmdnbohnytk$';

//Github Authentication
$_SESSION['github_id'] = "310d8a45f13df3dfbf95";
$_SESSION['github_secret'] = "0be78393c4533047b1e1e230cd3f8039e82879d5";
$_SESSION['github_scope'] = "repo";
$_SESSION['github_state'] = crypt($_SESSION['userId'], $_SESSION['cryptSalt']);
$_SESSION['github_auth_url'] = "https://github.com/login/oauth/authorize?client_id=";
$_SESSION['github_auth_url'] .= $_SESSION['github_id']."&scope=".$_SESSION['github_scope']."&state=".$_SESSION['github_state'];
?>