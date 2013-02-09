<?php
require($_SERVER['DOCUMENT_ROOT'].'/server/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/server/php/core/database.php');

if(isset($_GET['code'])) {
    if(urldecode($_GET['state']) == $_SESSION['github_state']) {
        $url = 'https://github.com/login/oauth/access_token';
        $fields = array(
                    'client_id' => urlencode($_SESSION['github_id']),
                    'client_secret' => urlencode($_SESSION['github_secret']),
                    'code' => $_GET['code'],
                    'state' => urlencode($_SESSION['github_state'])
                );

        $json  = jsonToarray(curlPost($url, $fields));

        if($json['error'] == "") {
            $updateSQL = sprintf("UPDATE users SET user_github=%s WHERE user_id=%s",
                    GetSQLValueString($json['access_token'], "text"),
                    $_SESSION['userId']);
            $UpdateSessions = mysql_query($updateSQL , $database) or die(mysql_error());

            $_SESSION['userGithub'] = $json['access_token'];

            if(isset($_SESSION['github_redirect']) && !is_null($_SESSION['github_redirect'])) {
                $redirect = $_SESSION['github_redirect'];
                $_SESSION['github_redirect'] = null;
                unset($_SESSION['github_redirect']);
                header("Location: ".$redirect);
            } else {
                header("Location: /account?github=1");
            }
        }
        else {
            header("Location: /account?github=0");
        }
    }
    else {
        header("Location: /account?github=0");
    }
} else {
    header("Location: /account?github=0");
}
?>