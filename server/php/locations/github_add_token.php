<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/user/restrict.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/core.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

if(isset($_GET['code'])) {
    if(urldecode($_GET['state']) == $_SESSION['github_state']) {
        $url = 'https://github.com/login/oauth/access_token';
        $fields = array(
                    'client_id' => urlencode($_SESSION['github_id']),
                    'client_secret' => urlencode($_SESSION['github_secret']),
                    'code' => $_GET['code'],
                    'state' => urlencode($_SESSION['github_state'])
                );

        $json  = jsonToArray(curlPost($url, $fields));

        if($json['error'] == "") {
            $updateSQL = sprintf("UPDATE users SET user_github=%s WHERE user_id=%s",
                    GetSQLValueString(aesEncrypt($json['access_token'], $_SESSION['cryptSalt']), "text"), $_SESSION['user']);
            $UpdateSessions = mysql_query($updateSQL , $database) or die(mysql_error());

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