<?php
require($_SERVER['DOCUMENT_ROOT'].'/php/core/config.php');
require($_SERVER['DOCUMENT_ROOT'].'/php/core/core.php');

if(!function_exists('cookieCheck')) {
    function cookieCheck() {
        require($_SERVER['DOCUMENT_ROOT'].'/php/core/database.php');

        if(isset($_COOKIE['USRRC'])) {
            $query_Login = sprintf("SELECT * FROM users, login WHERE login.login_user_id = users.user_id AND login.login_uuid = ".GetSQLValueString($_COOKIE['USRRC'], "text"));
            $Login = mysql_query($query_Login , $database) or die(mysql_error());
            $row_Login = mysql_fetch_assoc($Login);

            if($row_Login['login_uuid'] == $_COOKIE['USRRC']) {
                    $_SESSION['userId'] = $row_Login['user_id'];
                    $_SESSION['userName'] = $row_Login['user_name'];
                    $_SESSION['userEmail'] = $row_Login['user_email'];
                    $_SESSION['userLevel'] = $row_Login['user_level'];
                    if(!is_null($row_Login['user_github'])) {
                        $_SESSION['userGithub'] = aesDecrypt($row_Login['user_github'], $_SESSION['cryptSalt']);
                    } else {
                        $_SESSION['userGithub'] = $row_Login['user_github'];
                    }

                    $deleteSQL = sprintf("DELETE FROM login WHERE login.login_uuid = '".$_COOKIE['USRRC']."'");
                    $delete = mysql_query($deleteSQL , $database) or die(mysql_error());

                    $uuid = gen_uuid();
                    setcookie('USRRC', $uuid, time()+1209600, "/");

                    $insertSQL = sprintf("INSERT INTO login ( login_uuid, login_user_id ) VALUES (%s, %s)",
                    GetSQLValueString($uuid, "text"), $row_Login['user_id']);
                    $Sessions = mysql_query($insertSQL , $database) or die(mysql_error());
                    return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
?>