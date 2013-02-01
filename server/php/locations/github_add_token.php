<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_GET['code'])) {
    if($_GET['state'] == $_SESSION['userId']) {
        $url = 'https://github.com/login/oauth/access_token';
        $fields = array(
                    'client_id' => urlencode($_SESSION['github_id']),
                    'client_secret' => urlencode($_SESSION['github_secret']),
                    'code' => urlencode($_GET['code']),
                    'state' => urlencode($_SESSION['userId'])
                );

        $json  = jsonToarray(curlPost($url, $fields));

        if($json['error'] == "") {
            $updateSQL = sprintf("UPDATE users SET user_github=%s WHERE user_id=%s",
                    GetSQLValueString($json['access_token'], "text"),
                    $_SESSION['userId']);
            $UpdateSessions = mysql_query($updateSQL , $database) or die(mysql_error());

            $_SESSION['userGithub'] = $json['access_token'];

            header("Location: /account?github=1");
        }
        else {
            header("Location: /account?github=0");
        }
    }
    else {
        header("Location: /account?github=0");
    }
}
?>